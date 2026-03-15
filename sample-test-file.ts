/**
 * TypeScript Sample File
 * Demonstrates how the analyzer handles TypeScript types, interfaces,
 * and modern JS/TS features.
 */

// Define basic interfaces
interface User {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    lastLogin?: Date;
}

interface ApiResponse<T> {
    data: T | null;
    status: number;
    message: string;
}

/**
 * Service to handle API interactions
 */
export class ApiService {
    private baseUrl: string;
    private apiKey: string;
    
    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    
    // Fetch user details from the mock API
    public async getUser(userId: string): Promise<ApiResponse<User>> {
        try {
            console.log(`Fetching user ${userId} from ${this.baseUrl}...`);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Return mock data
            return {
                data: {
                    id: userId,
                    username: "developer_pro",
                    email: "dev@example.com",
                    isActive: true,
                    lastLogin: new Date()
                },
                status: 200,
                message: "Success"
            };
        } catch (error) {
            console.error("API Error:", error);
            
            return {
                data: null,
                status: 500,
                message: "Internal Server Error"
            };
        }
    }
    
    // Validate email configuration
    public static isValidEmail(email: string): boolean {
        // Basic regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            return false;
        }
        
        return emailRegex.test(email);
    }
}

// Utility function using arrow syntax
export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};
