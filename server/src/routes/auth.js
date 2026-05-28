import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../database/init.js';

export const authRoutes = async (fastify) => {
  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const { username, phone, email, password, public_key_rsa } = request.body;
      
      if (!username || !password) {
        return reply.code(400).send({ error: 'Username and password required' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      
      const pool = getPool();
      await pool.query(
        `INSERT INTO users (id, username, phone, email, password_hash, public_key_rsa)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, username, phone, email, hashedPassword, public_key_rsa]
      );
      
      const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '24h',
      });
      
      return {
        success: true,
        message: '✅ User registered successfully',
        userId,
        token,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Registration failed' });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const { username, password } = request.body;
      
      if (!username || !password) {
        return reply.code(400).send({ error: 'Username and password required' });
      }
      
      const pool = getPool();
      const result = await pool.query(
        `SELECT id, username, password_hash FROM users WHERE username = $1`,
        [username]
      );
      
      if (result.rows.length === 0) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '24h',
      });
      
      return {
        success: true,
        message: '✅ Login successful',
        userId: user.id,
        token,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Login failed' });
    }
  });

  // Get User Profile
  fastify.get('/profile/:userId', async (request, reply) => {
    try {
      const { userId } = request.params;
      const pool = getPool();
      
      const result = await pool.query(
        `SELECT id, username, phone, email, avatar_url, created_at FROM users WHERE id = $1`,
        [userId]
      );
      
      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      return { success: true, user: result.rows[0] };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch profile' });
    }
  });
};