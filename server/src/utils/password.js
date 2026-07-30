const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hashes cleartext password using bcrypt.
 * @param {string} password 
 * @returns {Promise<string>} Hashed password string
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares cleartext password with stored hash.
 * @param {string} candidatePassword 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>} True if match, false otherwise
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
