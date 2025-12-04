package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	// Import our packages
	"github.com/aswinbala005/rizeos/api/internal/config"
	"github.com/aswinbala005/rizeos/api/internal/db" // <-- This line was likely missing or incorrect
)

func main() {
    // 1. Load Configuration
    cfg, err := config.LoadConfig()
    if err != nil {
        log.Fatalf("Failed to load configuration: %v", err)
    }

    // 2. Connect to Database (This is now active)
    _, err = db.ConnectDB(cfg.DatabaseURL)
    if err != nil {
        log.Fatalf("Database connection failed: %v", err)
    }

    // 3. Initialize Fiber App
    app := fiber.New()

    // 4. Middleware
    app.Use(logger.New())
    app.Use(cors.New())

    // 5. Routes
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "status":  "ok",
            "message": "RizeOS API is running 🚀",
        })
    })

    // 6. Start Server
    log.Printf("Server starting on port %s", cfg.Port)
    log.Fatal(app.Listen(":" + cfg.Port))
}