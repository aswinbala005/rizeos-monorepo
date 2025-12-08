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

// --- GET /users/:wallet ---
func (h *UserHandler) GetUser(c *fiber.Ctx) error {
	wallet := c.Params("wallet")
	if wallet == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Wallet address required"})
	}
	walletText := pgtype.Text{String: wallet, Valid: true}
	user, err := h.queries.GetUserByWallet(c.Context(), walletText)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) || err.Error() == "no rows in result set" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"exists": false})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"exists": true, "user": user})
}

// --- POST /users ---
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

// --- PUT /users/:id ---
type Project struct {
	Title   string `json:"title"`
	Summary string `json:"summary"`
}

type UpdateUserRequest struct {
	FullName   string    `json:"full_name"`
	Email      string    `json:"email"`
	JobRole    string    `json:"job_role"`
	Bio        string    `json:"bio"`
	Skills     string    `json:"skills"`
	Experience string    `json:"experience"`
	Projects   []Project `json:"projects"` // Expects an array of Project objects
	Education  string    `json:"education"`
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

	// Marshal projects slice into JSON string
	projectsJSON, err := json.Marshal(req.Projects)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to process projects"})
	}

	arg := db.UpdateUserParams{
		ID:         uuid,
		FullName:   pgtype.Text{String: req.FullName, Valid: req.FullName != ""},
		Email:      pgtype.Text{String: req.Email, Valid: req.Email != ""},
		Bio:        pgtype.Text{String: req.Bio, Valid: req.Bio != ""},
		Skills:     pgtype.Text{String: req.Skills, Valid: req.Skills != ""},
		Experience: pgtype.Text{String: req.Experience, Valid: req.Experience != ""},
		// FIX: Convert bytes to string for pgtype.Text
		Projects:   pgtype.Text{String: string(projectsJSON), Valid: true},
		Education:  pgtype.Text{String: req.Education, Valid: req.Education != ""},
		JobRole:    pgtype.Text{String: req.JobRole, Valid: req.JobRole != ""},
	}
	user, err := h.queries.UpdateUser(c.Context(), arg)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user: " + err.Error()})
	}
	return c.JSON(user)
}