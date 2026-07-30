const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

class AuthService {
  /**
   * Registers a new user account
   */
  async registerUser({ username, email, password, role }) {
    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedEmail = email.trim().toLowerCase();

    // Check for duplicate username or email
    const existingUser = await User.findOne({
      $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }]
    });

    if (existingUser) {
      const isDuplicateEmail = existingUser.email === sanitizedEmail;
      const error = new Error(
        isDuplicateEmail
          ? 'An account with this email address already exists.'
          : 'This username is already taken.'
      );
      error.statusCode = 409;
      error.code = 'CONFLICT_ERROR';
      error.details = [
        {
          field: isDuplicateEmail ? 'email' : 'username',
          issue: isDuplicateEmail ? 'Email is already registered.' : 'Username is already taken.'
        }
      ];
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Persist new user
    const newUser = await User.create({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
      role: role || 'student'
    });

    // Issue JWT token
    const token = signToken({
      userId: newUser._id.toString(),
      username: newUser.username,
      role: newUser.role
    });

    return {
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      token
    };
  }

  /**
   * Authenticates user login credentials
   */
  async loginUser({ username, email, password }) {
    const identifier = (username || email || '').trim().toLowerCase();

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      const error = new Error('Invalid credentials provided.');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    // Verify password match
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials provided.');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    // Issue JWT token
    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    });

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    };
  }

  /**
   * Fetches active user profile by ID
   */
  async getMe(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User account not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}

module.exports = new AuthService();
