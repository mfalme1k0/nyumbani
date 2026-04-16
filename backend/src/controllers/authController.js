import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { config } from '../config.js';

const sanitizeUser = (row) => ({
  id: row.id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role,
  phone: row.phone,
  createdAt: row.created_at
});

export const register = async (req, res) => {
  const { email, password, firstName, lastName, role, phone } = req.body;
  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, passwordHash, firstName, lastName, role, phone]
    );

    const user = sanitizeUser(result.rows[0]);
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rowCount) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { id: user.id, role: user.role, email: user.email };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const me = async (req, res) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: sanitizeUser(result.rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
};
