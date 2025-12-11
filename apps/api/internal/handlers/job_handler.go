package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"math"
	"sort"
	"strings"

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

// --- CREATE JOB ---
type CreateJobRequest struct {
	RecruiterID     string `json:"recruiter_id" validate:"required,uuid"`
	RecruiterEmail  string `json:"recruiter_email" validate:"required,email"`
	Title           string `json:"title" validate:"required"`
	JobSummary      string `json:"job_summary"`
	Description     string `json:"description" validate:"required"`
	Education       string `json:"education_requirements"`
	Skills          string `json:"skills_requirements"`
	ExperienceMin   int32  `json:"experience_min"`
	ExperienceMax   int32  `json:"experience_max"`
	IsUnpaid        bool   `json:"is_unpaid"`
	SalaryMin       int32  `json:"salary_min"`
	SalaryMax       int32  `json:"salary_max"`
	Currency        string `json:"currency"`
	Benefits        string `json:"benefits"`
	JobType         string `json:"job_type"`
	LocationType    string `json:"location_type"`
	LocationCity    string `json:"location_city"`
}

func (h *JobHandler) CreateJob(c *fiber.Ctx) error {
	var req CreateJobRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	var recruiterUUID pgtype.UUID
	if err := recruiterUUID.Scan(req.RecruiterID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Recruiter ID"})
	}
	arg := db.CreateJobParams{
		RecruiterID:           recruiterUUID,
		RecruiterEmail:        pgtype.Text{String: req.RecruiterEmail, Valid: true},
		Title:                 req.Title,
		Description:           req.Description,
		IsPaid:                pgtype.Bool{Bool: false, Valid: true},
		JobSummary:            pgtype.Text{String: req.JobSummary, Valid: true},
		EducationRequirements: pgtype.Text{String: req.Education, Valid: true},
		SkillsRequirements:    pgtype.Text{String: req.Skills, Valid: true},
		IsUnpaid:              pgtype.Bool{Bool: req.IsUnpaid, Valid: true},
		JobType:               pgtype.Text{String: req.JobType, Valid: true},
		LocationType:          pgtype.Text{String: req.LocationType, Valid: true},
		LocationCity:          pgtype.Text{String: req.LocationCity, Valid: true},
		SalaryMin:             pgtype.Int4{Int32: req.SalaryMin, Valid: true},
		SalaryMax:             pgtype.Int4{Int32: req.SalaryMax, Valid: true},
		Currency:              pgtype.Text{String: req.Currency, Valid: true},
		ExperienceMin:         pgtype.Int4{Int32: req.ExperienceMin, Valid: true},
		ExperienceMax:         pgtype.Int4{Int32: req.ExperienceMax, Valid: true},
		Benefits:              pgtype.Text{String: req.Benefits, Valid: true},
		Requirements:          pgtype.Text{String: "", Valid: true},
	}
	job, err := h.queries.CreateJob(c.Context(), arg)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create job: " + err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(job)
}

// --- SMART MATCHING ALGORITHM ---

func parseTokens(s string) []string {
	parts := strings.FieldsFunc(s, func(r rune) bool {
		return r == ',' || r == ' ' || r == '/' || r == '-' || r == '|' || r == '\n'
	})
	var result []string
	for _, p := range parts {
		trimmed := strings.TrimSpace(strings.ToLower(p))
		if len(trimmed) > 1 && trimmed != "and" && trimmed != "or" {
			result = append(result, trimmed)
		}
	}
	return result
}

func calculateSmartScore(user db.GetUserByIDRow, job db.ListJobsRow) int {
	score := 0.0
	
	uRole := strings.ToLower(user.JobRole.String)
	jTitle := strings.ToLower(job.Title)
	uSkills := parseTokens(user.Skills.String)
	jSkills := parseTokens(job.SkillsRequirements.String)

	fmt.Printf("\n--- Matching User: '%s' vs Job: '%s' ---\n", uRole, jTitle)

	synonyms := map[string][]string{
		"ai":       {"machine learning", "ml", "deep learning", "computer vision", "nlp", "data scientist", "artificial intelligence", "pytorch", "tensorflow", "llm", "generative"},
		"ml":       {"machine learning", "ai", "deep learning", "data scientist", "neural networks", "pytorch", "tensorflow"},
		"data":     {"analyst", "scientist", "engineer", "sql", "python", "pandas", "spark", "hadoop", "etl"},
		"frontend": {"react", "vue", "angular", "next.js", "javascript", "typescript", "html", "css", "tailwind", "web", "ui", "ux"},
		"backend":  {"go", "golang", "node", "express", "java", "spring", "python", "django", "flask", "c#", ".net", "ruby", "rails", "php", "laravel", "api", "database", "sql", "postgres"},
		"fullstack": {"frontend", "backend", "web", "react", "node", "full-stack"},
		"mobile":   {"ios", "android", "swift", "kotlin", "flutter", "react native", "dart"},
		"devops":   {"cloud", "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform", "ansible", "linux", "sre", "reliability"},
		"web3":     {"blockchain", "solidity", "ethereum", "smart contract", "rust", "crypto", "defi", "nft", "token"},
	}

	// 1. Role/Title Match (Weight: 50%)
	roleMatch := false
	if strings.Contains(jTitle, uRole) || strings.Contains(uRole, jTitle) {
		score += 50
		roleMatch = true
		fmt.Println("  > Direct Role Match (+50)")
	} else {
		for key, vals := range synonyms {
			if strings.Contains(jTitle, key) {
				for _, v := range vals {
					if strings.Contains(uRole, v) {
						score += 45
						roleMatch = true
						fmt.Printf("  > Synonym Role Match: %s ~= %s (+45)\n", key, v)
						break
					}
				}
			}
			if !roleMatch && strings.Contains(uRole, key) {
				for _, v := range vals {
					if strings.Contains(jTitle, v) {
						score += 45
						roleMatch = true
						fmt.Printf("  > Synonym Role Match (Reverse): %s ~= %s (+45)\n", key, v)
						break
					}
				}
			}
			if roleMatch { break }
		}
	}

	// 2. Skill Match (Weight: 50%)
	if len(jSkills) > 0 {
		matches := 0
		for _, j := range jSkills {
			for _, u := range uSkills {
				if strings.Contains(u, j) || strings.Contains(j, u) {
					matches++
					break
				}
			}
		}
		
		ratio := float64(matches) / float64(len(jSkills))
		points := ratio * 50
		score += points
		fmt.Printf("  > Skill Score: %.2f (Matches: %d/%d)\n", points, matches, len(jSkills))
	} else {
		if roleMatch { score += 20 }
	}

	// 3. Contextual Boost (Bonus Points)
	if (strings.Contains(jTitle, "senior") && strings.Contains(uRole, "senior")) {
		score += 10
		fmt.Println("  > Seniority Match (+10)")
	}

	// 4. Final Cap
	if score > 99 { score = 99 }
	if score < 15 { score = 15 }

	fmt.Printf("  = Final Score: %d\n", int(score))
	return int(math.Round(score))
}

func (h *JobHandler) ListJobs(c *fiber.Ctx) error {
	candidateID := c.Query("candidate_id")
	jobs, err := h.queries.ListJobs(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch jobs"})
	}

	if candidateID == "" {
		return c.JSON(jobs)
	}

	var uuid pgtype.UUID
	if err := uuid.Scan(candidateID); err != nil {
		return c.JSON(jobs)
	}
	
	user, err := h.queries.GetUserByID(c.Context(), uuid)
	if err != nil {
		return c.JSON(jobs)
	}

	type JobWithMatch struct {
		db.ListJobsRow
		MatchScore int `json:"match_score"`
	}

	var response []JobWithMatch

	for _, job := range jobs {
		score := calculateSmartScore(user, job)
		response = append(response, JobWithMatch{
			ListJobsRow: job,
			MatchScore:  score,
		})
	}

	sort.Slice(response, func(i, j int) bool {
		return response[i].MatchScore > response[j].MatchScore
	})

	return c.JSON(response)
}

// --- LIST JOBS BY RECRUITER ---
func (h *JobHandler) ListJobsByRecruiter(c *fiber.Ctx) error {
	recruiterID := c.Params("id")
	var uuid pgtype.UUID
	
	if err := uuid.Scan(recruiterID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Recruiter ID format"})
	}

	jobs, err := h.queries.ListJobsByRecruiter(c.Context(), uuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) || err.Error() == "no rows in result set" {
			return c.JSON([]interface{}{}) // Return empty array
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch recruiter jobs"})
	}

	if jobs == nil {
		return c.JSON([]interface{}{}) // Return empty array
	}

	return c.JSON(jobs)
}

// CloseJob marks a job as CLOSED
func (h *JobHandler) CloseJob(c *fiber.Ctx) error {
	jobID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(jobID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Job ID"})
	}

	err := h.queries.CloseJob(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to close job"})
	}

	return c.JSON(fiber.Map{"message": "Job closed successfully"})


}

// ReopenJob marks a job as OPEN
func (h *JobHandler) ReopenJob(c *fiber.Ctx) error {
	jobID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(jobID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Job ID"})
	}

	err := h.queries.ReopenJob(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to reopen job"})
	}

	return c.JSON(fiber.Map{"message": "Job reopened successfully"})
}


// GetDashboardStats returns application counts for a recruiter's jobs
func (h *JobHandler) GetDashboardStats(c *fiber.Ctx) error {
	recruiterID := c.Params("id")
	var uuid pgtype.UUID
	if err := uuid.Scan(recruiterID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Recruiter ID"})
	}

	stats, err := h.queries.GetJobApplicationCounts(c.Context(), uuid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch stats"})
	}

    // Handle empty result
    if stats == nil {
        return c.JSON([]interface{}{})
    }

	return c.JSON(stats)
}