package main

import "log"

func main() {
	server, err := NewServer()
	if err != nil {
		log.Fatalf("Failed to setup server: %v", err)
	}

	server.Start()
}