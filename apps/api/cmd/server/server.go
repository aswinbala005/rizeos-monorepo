package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/aswinbala005/rizeos/api/internal/config"
	"github.com/aswinbala005/rizeos/api/internal/db"
	"github.com/aswinbala005/rizeos/api/internal/handlers"

	
)

// Server holds all dependencies for our application
type Server struct {
	config  *config.Config
	db      *pgxpool.Pool
	queries *db.Queries
	router  *fiber.App
}

// NewServer creates a new Server instance
func NewServer() (*Server, error) {
	// 1. Load config
	cfg, err := config.LoadConfig()
	if err != nil {
		return nil, err
	}

	// 2. Connect to DB
	pool, err := db.ConnectDB(cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	// 3. Initialize sqlc Queries
	queries := db.New(pool)

	// 4. Create Fiber app
	app := fiber.New()

	server := &Server{
		config:  cfg,
		db:      pool,
		queries: queries,
		router:  app,
	}

	server.setupMiddleware()
	server.setupRoutes()

	return server, nil
}

// setupMiddleware configures all the middleware
func (s *Server) setupMiddleware() {
	s.router.Use(recover.New())
	s.router.Use(logger.New())
	
	// FIX: Allow all origins, headers, and methods for development
	s.router.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))
}

// setupRoutes defines all the application routes
func (s *Server) setupRoutes() {
	// Group all routes under /api/v1
	api := s.router.Group("/api/v1")

	// Health Check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// --- Initialize Handlers ---
	userHandler := handlers.NewUserHandler(s.queries)
	jobHandler := handlers.NewJobHandler(s.queries)
	appHandler := handlers.NewApplicationHandler(s.queries)
	resumeHandler := handlers.NewResumeHandler() // <-- New Resume Handler

	// --- User Routes ---
	api.Post("/users", userHandler.CreateUser)
	api.Get("/users/:wallet", userHandler.GetUser)
	api.Put("/users/:id", userHandler.UpdateUser)

	// --- Job Routes ---
	api.Post("/jobs", jobHandler.CreateJob)
	api.Get("/jobs", jobHandler.ListJobs)

	// --- Application Routes ---
	api.Post("/applications", appHandler.ApplyToJob)
	api.Get("/applications/:id", appHandler.GetMyApplications)
	api.Delete("/applications/:id", appHandler.WithdrawApplication)

	// --- AI Routes ---
	api.Post("/parse-resume", resumeHandler.ParseResume) // <-- New Route
}

// Start runs the HTTP server with graceful shutdown
func (s *Server) Start() {
	// Create a channel to listen for OS signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Run the server in a separate goroutine so it doesn't block
	go func() {
		log.Printf("Server starting on port %s", s.config.Port)
		if err := s.router.Listen(":" + s.config.Port); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for a signal (Ctrl+C)
	<-quit
	log.Println("Shutting down server...")

	// Close the database connection pool
	s.db.Close()
	log.Println("Database connection closed.")

	// Shutdown the Fiber app
	if err := s.router.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}