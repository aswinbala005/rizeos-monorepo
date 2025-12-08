package handlers

import (
	"github.com/aswinbala005/rizeos/api/internal/db"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
)

type JobHandler struct {
	queries  *db.Queries
	validate *validator.Validate
}

func NewJobHandler(queries *db.Queries) *JobHandler {
	return &JobHandler{
		queries:  queries,
		validate: validator.New(),
	}
}

// Request DTO for Creating a Job
type CreateJobRequest struct {
	RecruiterID     string `json:"recruiter_id" validate:"required,uuid"`
	Title           string `json:"title" validate:"required,min=5"`
	Description     string `json:"description" validate:"required,min=20"`
	GatewayQuestion string `json:"gateway_question" validate:"required"`
}

// CreateJob handles posting a new job
func (h *JobHandler) CreateJob(c *fiber.Ctx) error {
	var req CreateJobRequest

	// 1. Parse Body
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// 2. Validate Input
	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// 3. Convert UUID string to pgtype.UUID
	var recruiterUUID pgtype.UUID
	if err := recruiterUUID.Scan(req.RecruiterID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Recruiter ID format"})
	}

	// 4. Save to DB
	arg := db.CreateJobParams{
		RecruiterID:     recruiterUUID,
		Title:           req.Title,
		Description:     req.Description,
		GatewayQuestion: pgtype.Text{String: req.GatewayQuestion, Valid: true},
		IsPaid:          pgtype.Bool{Bool: false, Valid: true}, // Default to false until crypto payment
	}

	job, err := h.queries.CreateJob(c.Context(), arg)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create job: " + err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(job)
}

// ListJobs returns all jobs (For the Job Feed)
func (h *JobHandler) ListJobs(c *fiber.Ctx) error {
	jobs, err := h.queries.ListJobs(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch jobs"})
	}
	return c.JSON(jobs)
}