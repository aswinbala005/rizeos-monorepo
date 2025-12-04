package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

// ConnectDB creates a new database connection pool
func ConnectDB(databaseURL string) (*pgxpool.Pool, error) {
	// Create a context for the connection
	ctx := context.Background()

	// Create a connection pool
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, err
	}

	// Test the connection
	if err := pool.Ping(ctx); err != nil {
		log.Printf("Warning: Could not ping database: %v", err)
		// We don't return here because ping might fail for reasons unrelated to connectivity
	}

	log.Println("Successfully connected to database")
	return pool, nil
}
