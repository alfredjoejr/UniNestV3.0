
/**
 * Production-ready Server with MySQL
 * 
 * Required Dependencies:
 * npm install express cors body-parser jsonwebtoken bcryptjs mysql2
 * 
 * Environment Variables (create a .env file or set these in your cloud provider):
 * DB_HOST=localhost
 * DB_USER=root
 * DB_PASSWORD=your_password
 * DB_NAME=uninest_db
 * JWT_SECRET=your_secret_key
 * PORT=5000
 * 
 * Run with:
 * node server/index.js
 */
import 'dotenv/config'; 

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'Test@9050', // Default, change as needed
  database: process.env.DB_NAME || 'uninest_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database Schema
async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL Database.');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database schema verified.');
    connection.release();
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    console.error('Make sure your MySQL server is running and the credentials in server/index.js are correct.');
  }
}

// Initialize on startup
initDB();

// --- Routes ---

// 1. Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    // Insert new user
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role, avatar]
    );

    // Create Token
    const token = jwt.sign({ id: userId, email: email }, SECRET_KEY, { expiresIn: '7d' });

    // Return User (exclude password)
    const newUser = { id: userId, name, email, role, avatar };

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create Token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. Get Current User (Session)
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    const [users] = await pool.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [decoded.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
