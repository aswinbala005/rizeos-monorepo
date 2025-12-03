package main

import (
    "log"
    "os"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/joho/godotenv"
)

func main() {
    // 1. Load Environment Variables
    // It's okay if .env doesn't exist yet (for production)
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    // 2. Initialize Fiber App
    app := fiber.New()

    // 3. Middleware
    app.Use(logger.New()) // Log requests
    app.Use(cors.New())   // Allow Frontend to talk to Backend

    // 4. Routes
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "status":  "ok",
            "message": "RizeOS API is running 🚀",
        })
    })

    // 5. Start Server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}