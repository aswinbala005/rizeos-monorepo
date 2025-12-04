package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config struct holds all configuration for the application
type Config struct {
    Port        string
    DatabaseURL string
}

// LoadConfig loads application configuration from environment variables
func LoadConfig() (*Config, error) {
    // Load .env file if it exists
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }

    cfg := &Config{
        Port:        os.Getenv("PORT"),
        DatabaseURL: os.Getenv("DATABASE_URL"),
    }

    // Set default port if not specified
    if cfg.Port == "" {
        cfg.Port = "8080"
    }

    return cfg, nil
}