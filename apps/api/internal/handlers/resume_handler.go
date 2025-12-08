package handlers

import (
	"github.com/aswinbala005/rizeos/api/internal/services"
	"github.com/gofiber/fiber/v2"
)

type ResumeHandler struct{}

func NewResumeHandler() *ResumeHandler {
	return &ResumeHandler{}
}

type ParseRequest struct {
	Url string `json:"url"`
}

func (h *ResumeHandler) ParseResume(c *fiber.Ctx) error {
	var req ParseRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if req.Url == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "URL is required"})
	}

	// 1. Extract Text
	text, err := services.ExtractTextFromPDF(req.Url)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read PDF: " + err.Error()})
	}

	// 2. AI Parse
	data, err := services.ParseResumeWithAI(text)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI Parsing failed: " + err.Error()})
	}

	return c.JSON(data)
}