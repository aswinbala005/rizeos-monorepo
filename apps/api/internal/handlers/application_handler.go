package handlers

import (
	"github.com/aswinbala005/rizeos/api/internal/db"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
)

type ApplicationHandler struct {
	queries  *db.Queries
	validate *validator.Validate
}

func NewApplicationHandler(queries *db.Queries) *ApplicationHandler {
	return &ApplicationHandler{
		queries:  queries,
		validate: validator.New(),
	}
}

type CreateApplicationRequest struct {
	JobID         string `json:"job_id" validate:"required,uuid"`
	CandidateID   string `json:"candidate_id" validate:"required,uuid"`
	MatchScore    int32  `json:"match_score"`
	GatewayAnswer string `json:"gateway_answer"`
}

// ApplyToJob handles the application submission
func (h *ApplicationHandler) ApplyToJob(c *fiber.Ctx) error {
	var req CreateApplicationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var jobUUID, candidateUUID pgtype.UUID
	if err := jobUUID.Scan(req.JobID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Job ID"})
	}
	if err := candidateUUID.Scan(req.CandidateID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Candidate ID"})
	}

    // Set default match score (Requirements and match calculation removed)
    matchScore := int32(50)

	arg := db.CreateApplicationParams{
		JobID:         jobUUID,
		CandidateID:   candidateUUID,
		Status:        "SENT",
		MatchScore:    pgtype.Int4{Int32: int32(matchScore), Valid: true},
		GatewayAnswer: pgtype.Text{String: req.GatewayAnswer, Valid: true},
	}

	app, err := h.queries.CreateApplication(c.Context(), arg)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to apply: " + err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(app)
}

// GetMyApplications fetches applications for a specific user
func (h *ApplicationHandler) GetMyApplications(c *fiber.Ctx) error {
	candidateID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(candidateID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid User ID"})
	}

	apps, err := h.queries.GetApplicationsByCandidate(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch applications"})
	}

	return c.JSON(apps)
}

// WithdrawApplication deletes an application
func (h *ApplicationHandler) WithdrawApplication(c *fiber.Ctx) error {
	appID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(appID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Application ID"})
	}

	err := h.queries.DeleteApplication(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to withdraw application"})
	}

	return c.JSON(fiber.Map{"message": "Application withdrawn successfully"})
}

// GetJobApplications fetches all applications for a specific job
func (h *ApplicationHandler) GetJobApplications(c *fiber.Ctx) error {
	jobID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(jobID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Job ID"})
	}

	apps, err := h.queries.GetApplicationsByJob(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch applications"})
	}

	// Handle empty result
	if apps == nil {
		return c.JSON([]interface{}{})
	}

	return c.JSON(apps)
}

// GetApplicationVolume fetches daily application counts for a recruiter
func (h *ApplicationHandler) GetApplicationVolume(c *fiber.Ctx) error {
	recruiterID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(recruiterID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Recruiter ID"})
	}

	volume, err := h.queries.GetApplicationVolumeByRecruiter(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch volume data"})
	}

	// Handle empty result
	if volume == nil {
		return c.JSON([]interface{}{})
	}

	return c.JSON(volume)
}

// GetRecruiterApplications fetches all applications for a recruiter's jobs
func (h *ApplicationHandler) GetRecruiterApplications(c *fiber.Ctx) error {
	recruiterID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(recruiterID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Recruiter ID"})
	}

	apps, err := h.queries.GetAllApplicationsByRecruiter(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch applications"})
	}
    
    if apps == nil {
        return c.JSON([]interface{}{})
    }

	return c.JSON(apps)
}