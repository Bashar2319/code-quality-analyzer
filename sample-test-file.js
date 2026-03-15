/**
 * Sample JavaScript file for Code Quality Analyzer Dashboard
 * This file contains various functions, comments, and logic structures 
 * to demonstrate how the analyzer calculates metrics.
 */

// Basic math utility functions
function add(a, b) {
    return a + b;
}

const subtract = (a, b) => {
    return a - b;
};

/*
 * User Manangement Module
 * Connects to a mock database to handle user operations.
 */
class UserManager {
    constructor() {
        this.users = [];
        this.isAuthenticated = false;
    }

    login(username, password) {
        if (!username || !password) {
            throw new Error("Credentials required");
        }

        // Mock authentication check
        if (username === "admin" && password === "password123") {
            this.isAuthenticated = true;
            return true;
        }

        return false;
    }

    addUser(user) {
        if (this.isAuthenticated) {
            this.users.push(user);
            console.log("User added successfully.");
        } else {
            console.error("Must be logged in to add users.");
        }
    }
    
    // Process a list of names and format them
    processUserList(names) {
        let processed = [];
        
        for (let i = 0; i < names.length; i++) {
            const name = names[i].trim();
            
            if (name.length > 0) {
                processed.push({
                    id: i,
                    displayName: name.toUpperCase(),
                    active: true
                });
            }
        }
        
        return processed;
    }
}

// Data processing pipeline
function runPipeline(data) {
    let result = 0;
    
    try {
        let count = 0;
        
        while (count < data.length) {
            let value = data[count];
            
            switch (typeof value) {
                case 'number':
                    result += value;
                    break;
                case 'string':
                    result += parseInt(value) || 0;
                    break;
                default:
                    // Ignore other types
                    break;
            }
            
            count++;
        }
    } catch (e) {
        console.error("Pipeline failed", e);
    }
    
    return result;
}

// Export the modules
module.exports = {
    add,
    subtract,
    UserManager,
    runPipeline
};
