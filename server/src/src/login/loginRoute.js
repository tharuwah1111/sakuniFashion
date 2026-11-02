import { Router } from 'express';
import { db } from '../database/db.js';

export const loginRouter = Router();

// POST /api/login
loginRouter.post('/', (req, res) => {
  const user_name = req.body.user_name || req.body.username;
  const password = req.body.password;
  if (!user_name || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = db.getData().Users.filter(u => u.is_deleted === 0);
  const user = users.find(u => (u.user_name === user_name || u.username === user_name) && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  return res.json({
    success: true,
    user: {
      User_id: user.User_id,
      user_name: user.user_name,
      created_at: user.created_at,
    },
  });
});

// GET /api/login/users
loginRouter.get('/users', (_req, res) => {
  const users = db.getData().Users.filter(u => u.is_deleted === 0).map(u => ({
    User_id: u.User_id,
    user_name: u.user_name,
    created_at: u.created_at,
  }));
  res.json(users);
});

// POST /api/login/users
loginRouter.post('/users', (req, res) => {
  const { user_name, password } = req.body;
  if (!user_name || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const data = db.getData();
  const exists = data.Users.some(u => u.user_name.toLowerCase() === user_name.toLowerCase() && u.is_deleted === 0);
  if (exists) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const newUser = {
    User_id: `USR${String(data.Users.length + 1).padStart(3, '0')}`,
    user_name,
    password,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    is_deleted: 0,
  };

  data.Users.push(newUser);
  db.save();

  res.status(201).json({
    User_id: newUser.User_id,
    user_name: newUser.user_name,
    created_at: newUser.created_at,
  });
});
