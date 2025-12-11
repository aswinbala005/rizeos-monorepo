package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/aswinbala005/rizeos/api/internal/db"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	queries  *db.Queries
	validate *validator.Validate
}

func NewUserHandler(queries *db.Queries) *UserHandler {
	return &UserHandler{
		queries:  queries,
		validate: validator.New(),
	}
}

// --- LOGIN ---
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func (h *UserHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	user, err := h.queries.GetUserByEmail(c.Context(), pgtype.Text{String: req.Email, Valid: true})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) || err.Error() == "no rows in result set" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	if !user.PasswordHash.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid login method"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash.String), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	return c.JSON(fiber.Map{"message": "Login successful", "user": user})
}

// --- GET USER ---
func (h *UserHandler) GetUser(c *fiber.Ctx) error {
	identifier := c.Params("email")
	if identifier == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Identifier required"})
	}

	var user db.User
	var err error

	if len(identifier) == 42 && identifier[0] == '0' && identifier[1] == 'x' {
		user, err = h.queries.GetUserByWallet(c.Context(), pgtype.Text{String: identifier, Valid: true})
	} else {
		user, err = h.queries.GetUserByEmail(c.Context(), pgtype.Text{String: identifier, Valid: true})
	}

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) || err.Error() == "no rows in result set" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"exists": false})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"exists": true, "user": user})
}

// --- CREATE USER ---
type CreateUserRequest struct {
	WalletAddress string `json:"wallet_address" validate:"required"`
	Email         string `json:"email" validate:"required,email"`
	Role          string `json:"role" validate:"required,oneof=CANDIDATE RECRUITER"`
	FullName      string `json:"full_name" validate:"required,min=2"`
	Password      string `json:"password" validate:"required,min=6"`
}

func (h *UserHandler) CreateUser(c *fiber.Ctx) error {
	var req CreateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	arg := db.CreateUserParams{
		WalletAddress: pgtype.Text{String: req.WalletAddress, Valid: true},
		Email:         pgtype.Text{String: req.Email, Valid: true},
		Role:          db.UserRole(req.Role),
		FullName:      pgtype.Text{String: req.FullName, Valid: true},
		PasswordHash:  pgtype.Text{String: string(hashedBytes), Valid: true},
	}
	user, err := h.queries.CreateUser(c.Context(), arg)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user: " + err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(user)
}

// SearchCandidates handles searching for candidates by keyword
func (h *UserHandler) SearchCandidates(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Query parameter 'q' is required"})
	}

	// text := pgtype.Text{String: query, Valid: true} // <-- REMOVED: sqlc generates string for this now
	users, err := h.queries.SearchCandidates(c.Context(), query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to search candidates"})
	}

	return c.JSON(users)
}

// --- UPDATE USER ---
type Project struct {
	Title   string `json:"title"`
	Summary string `json:"summary"`
}

type UpdateUserRequest struct {
	FullName          string    `json:"full_name"`
	// Email removed from update to prevent login overwrite
	ProfessionalEmail string    `json:"professional_email"` // <-- NEW
	JobRole           string    `json:"job_role"`
	Bio               string    `json:"bio"`
	Skills            string    `json:"skills"`
	Experience        string    `json:"experience"`
	Education         string    `json:"education"`
	Projects          []Project `json:"projects"`
	Phone             string    `json:"phone"`
	OrganizationName  string    `json:"organization_name"`
	OrganizationLocation string `json:"organization_location"`
	OrganizationBio   string    `json:"organization_bio"`
}

func (h *UserHandler) UpdateUser(c *fiber.Ctx) error {
	userID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(userID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid User ID"})
	}
	var req UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	existingUser, err := h.queries.GetUserByID(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	var updatedUser db.User

	if req.OrganizationName != "" || existingUser.Role == db.UserRoleRECRUITER {
		// --- UPDATE RECRUITER ---
		arg := db.UpdateRecruiterProfileParams{
			ID:                   uuid,
			FullName:             pgtype.Text{String: req.FullName, Valid: req.FullName != ""},
			Phone:                pgtype.Text{String: req.Phone, Valid: req.Phone != ""},
			OrganizationName:     pgtype.Text{String: req.OrganizationName, Valid: req.OrganizationName != ""},
			OrganizationLocation: pgtype.Text{String: req.OrganizationLocation, Valid: req.OrganizationLocation != ""},
			OrganizationBio:      pgtype.Text{String: req.OrganizationBio, Valid: req.OrganizationBio != ""},
			Bio:                  pgtype.Text{String: req.Bio, Valid: req.Bio != ""},
			Skills:               pgtype.Text{String: req.Skills, Valid: req.Skills != ""},
			Experience:           pgtype.Text{String: req.Experience, Valid: req.Experience != ""},
			Education:            pgtype.Text{String: req.Education, Valid: req.Education != ""},
			JobRole:              pgtype.Text{String: req.JobRole, Valid: req.JobRole != ""},
			ProfessionalEmail:    pgtype.Text{String: req.ProfessionalEmail, Valid: req.ProfessionalEmail != ""}, // <-- NEW
		}
		updatedUser, err = h.queries.UpdateRecruiterProfile(c.Context(), arg)
	} else {
		// --- UPDATE SEEKER ---
		projectsJSON, _ := json.Marshal(req.Projects)
		arg := db.UpdateSeekerProfileParams{
			ID:                uuid,
			FullName:          pgtype.Text{String: req.FullName, Valid: req.FullName != ""},
			Bio:               pgtype.Text{String: req.Bio, Valid: req.Bio != ""},
			Skills:            pgtype.Text{String: req.Skills, Valid: req.Skills != ""},
			Experience:        pgtype.Text{String: req.Experience, Valid: req.Experience != ""},
			Projects:          projectsJSON,
			Education:         pgtype.Text{String: req.Education, Valid: req.Education != ""},
			JobRole:           pgtype.Text{String: req.JobRole, Valid: req.JobRole != ""},
			ProfessionalEmail: pgtype.Text{String: req.ProfessionalEmail, Valid: req.ProfessionalEmail != ""}, // <-- NEW
		}
		updatedUser, err = h.queries.UpdateSeekerProfile(c.Context(), arg)
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user: " + err.Error()})
	}
	return c.JSON(updatedUser)
}