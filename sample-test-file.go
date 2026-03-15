package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

// ServerConfig holds the configuration for our web server
type ServerConfig struct {
	Port    string
	Timeout time.Duration
	Retries int
}

// User represents a system user account
type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

var (
	userCache = make(map[int]User)
	cacheMux  sync.RWMutex
)

// fetchUser simulates fetching a user from a database
func fetchUser(id int) (*User, error) {
	// Let's pretend this connects to a postgres DB
	time.Sleep(100 * time.Millisecond)
	
	if id <= 0 {
		return nil, fmt.Errorf("invalid user ID: %d", id)
	}

	return &User{
		ID:        id,
		Username:  fmt.Sprintf("user_%d", id),
		IsActive:  true,
		CreatedAt: time.Now(),
	}, nil
}

// getUserHandler handles HTTP requests for user data
func getUserHandler(w http.ResponseWriter, r *http.Request) {
	// In a real app we'd parse the ID from the URL
	testID := 42
	
	// Check cache first (concurrency safe)
	cacheMux.RLock()
	cachedUser, exists := userCache[testID]
	cacheMux.RUnlock()
	
	if exists {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(cachedUser)
		return
	}
	
	user, err := fetchUser(testID)
	
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	
	// Fast lock for writing to cache
	cacheMux.Lock()
	userCache[testID] = *user
	cacheMux.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

/*
 * StartServer initializes the router and starts the HTTP server.
 * It uses the provided configuration struct for settings.
 */
func StartServer(config ServerConfig) {
	http.HandleFunc("/api/user", getUserHandler)

	fmt.Printf("Starting secure server on port %s...\n", config.Port)
	err := http.ListenAndServe(":"+config.Port, nil)
	
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
		os.Exit(1)
	}
}

func main() {
	cfg := ServerConfig{
		Port:    "8080",
		Timeout: 30 * time.Second,
		Retries: 3,
	}
	
	fmt.Println("Initializing Go backend application...")
	StartServer(cfg)
}
