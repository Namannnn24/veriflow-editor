import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'veriflow-dev-secret-key';

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const id = uuidv4();
    const created_at = new Date().toISOString();

    db.prepare('INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)').run(
      id, email, password_hash, name, created_at
    );

    const user = { id, email, name };
    const token = jwt.sign(user, secret, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const userPayload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(userPayload, secret, { expiresIn: '7d' });

    res.json({ token, user: userPayload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
