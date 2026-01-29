
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
import nodemailer from 'nodemailer'; 

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

// Nodemailer Transporter (for email functionality, e.g., password resets)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use 'smtp.mailtrap.io' for testing
  auth: {
    user: process.env.EMAIL_USER, // Add to your .env file
    pass: process.env.EMAIL_PASS  // Add to your .env file
  }
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

// 1. Sign Up (Modified for OTP)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // Insert user with is_verified = FALSE (0)
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, avatar, is_verified, otp_code, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role, avatar, false, otp, expiry]
    );

    // Send Email
    await transporter.sendMail({
      from: '"UniNest" <noreply@uninest.com>',
      to: email,
      subject: 'Verify your UniNest Account',
      text: `Your verification code is: ${otp}`,
      html: `<b>Your verification code is: ${otp}</b>`
    });

    // DO NOT send the token yet. Only send a success message.
    res.status(201).json({ message: 'Signup successful. Please verify your email.' });
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
    // Check if verified
    if (!user.is_verified) {
       return res.status(403).json({ message: 'Please verify your email first.' });
    }

    // Verify Password...
    // ... rest of the code
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

// 4. Verify OTP (New Route)
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user with matching Email AND OTP
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) return res.status(400).json({ message: 'User not found' });
    
    const user = users[0];

    // Check if verified already
    if (user.is_verified) return res.status(200).json({ message: 'Already verified' });

    // Validate OTP
    if (user.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check Expiry
    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: 'OTP Expired' });
    }

    // Mark as Verified and Clear OTP
    await pool.query('UPDATE users SET is_verified = TRUE, otp_code = NULL, otp_expires_at = NULL WHERE id = ?', [user.id]);

    // NOW we create the token because they are verified
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    
    // Remove sensitive data
    const { password: _, otp_code: __, ...userData } = user;
    
    // Manually set is_verified to true for the response since we just updated DB
    userData.is_verified = 1;

    res.json({ user: userData, token });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
