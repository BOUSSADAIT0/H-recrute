// JobMatchApp\backend\src\utils\auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

// Générer un token JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
};

// Hacher un mot de passe
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparer un mot de passe avec sa version hachée
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword
};