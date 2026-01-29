
import { User } from '../types';

// In production, this would come from an environment variable (e.g. process.env.REACT_APP_API_URL)
// For now, we point to the local server port.
const API_URL = 'http://localhost:5000/api';

/**
 * The API Service Layer.
 * Connects to the Node.js backend server.
 */
export const AuthService = {
  
  // No-op for API client, but kept for compatibility if needed
  init: () => {},

  /**
   * Helper to handle response parsing and error throwing
   */
  async _handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  },

  /**
   * Sign Up a new user
   */
  async signUp(name: string, email: string, password: string, role: 'STUDENT' | 'LANDLORD'): Promise<User> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await AuthService._handleResponse(response);
    
    // Store the JWT token
    localStorage.setItem('token', data.token);
    return data.user;
  },

  /**
   * Log In an existing user
   */
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await AuthService._handleResponse(response);
    
    // Store the JWT token
    localStorage.setItem('token', data.token);
    return data.user;
  },

  /**
   * Log Out
   */
  async logout(): Promise<void> {
    localStorage.removeItem('token');
  },

  /**
   * Get Current Session using the stored JWT
   */
  async getSession(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
      });

      if (!response.ok) {
        // If token is invalid or expired, clear it
        localStorage.removeItem('token');
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Session check failed", error);
      return null;
    }
  }
};
