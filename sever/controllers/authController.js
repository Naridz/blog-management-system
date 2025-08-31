const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const secret = process.env.JWT_SECRET;

const saltRounds = 10;

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  db.execute(
    'SELECT * FROM users WHERE email = ?', [email],
    (err, result) => {
      if (err) return res.json({ status: 'error', message: err });
      if (result.length > 0) {
        return res.json({ status: 'exist', message: 'Email already exists' });
      }
      
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) return res.json({ status: 'error', message: err });
    db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [req.body.username, req.body.email, hash],
      (err, results) => {
        if (err) return res.json({ status: 'error', message: err });
        res.json({ status: 'ok' });
          }
        );
      });
    }
  );
};

exports.login = (req, res) => {
  db.execute(
    'SELECT * FROM users WHERE email = ?',
    [req.body.email],
    (err, users) => {
      if (err) return res.json({ status: 'error', message: err });
      if (users.length === 0)
        return res.json({ status: 'error', message: 'user not found' });

      bcrypt.compare(req.body.password, users[0].password, (err, isLogin) => {
        if (isLogin) {
          const token = jwt.sign(
            { email: users[0].email, id: users[0].id},
            secret,
            { expiresIn: '24h' }
          );
          res.json({ status: 'ok', message: 'login success', token });
        } else {
          res.json({ status: 'error', message: 'invalid password' });
        }
      });
    }
  );
};

exports.auth = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};