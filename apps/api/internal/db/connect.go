package db

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	pgxvector "github.com/pgvector/pgvector-go/pgx"
)

// ConnectDB creates a new database connection pool
func ConnectDB(databaseURL string) (*pgxpool.Pool, error) {
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable is not set")
	}

	// 1. Parse the configuration
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("unable to parse database config: %w", err)
	}

	// 2. Register pgvector types immediately after connecting
	config.AfterConnect = func(ctx context.Context, conn *pgx.Conn) error {
		return pgxvector.RegisterTypes(ctx, conn)
	}

	// 3. Create the pool with the config
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %w", err)
	}

	// 4. Ping to verify
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("could not ping database: %w", err)
	}

	log.Println("✅ Successfully connected to the database (with Vector support)!")
	return pool, nil
}