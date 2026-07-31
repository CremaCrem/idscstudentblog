const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

class AuthService {
  /**
   * Registers a new user account
   */
  async registerUser({ fullName, studentId, username, email, password, role }) {
    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedStudentId = studentId.trim().toUpperCase();

    // Check for duplicate username, email, or studentId
    const existingUser = await User.findOne({
      $or: [
        { username: sanitizedUsername },
        { email: sanitizedEmail },
        { studentId: sanitizedStudentId }
      ]
    });

    if (existingUser) {
      let field = 'username';
      let issue = 'Username is already taken.';
      
      if (existingUser.studentId === sanitizedStudentId) {
        field = 'studentId';
        issue = 'Student ID already registered. If you recently submitted a registration, your account is pending admin review.';
      } else if (existingUser.email === sanitizedEmail) {
        field = 'email';
        issue = 'Email is already registered.';
      }

      const error = new Error(issue);
      error.statusCode = 409;
      error.code = 'CONFLICT_ERROR';
      error.details = [{ field, issue }];
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Persist new user with pending status
    const newUser = await User.create({
      fullName: fullName.trim(),
      studentId: sanitizedStudentId,
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
      role: role || 'student',
      verificationStatus: 'pending'
    });

    // We do NOT issue a JWT token here because the account is pending approval
    return {
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        verificationStatus: newUser.verificationStatus,
        createdAt: newUser.createdAt
      }
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

    // Check verification status (skip for admins)
    if (user.role !== 'admin') {
      if (user.verificationStatus === 'pending') {
        const error = new Error('Your account is pending administrator verification. Please wait for approval before logging in.');
        error.statusCode = 403;
        error.code = 'ACCOUNT_PENDING_APPROVAL';
        throw error;
      }
      if (user.verificationStatus === 'rejected') {
        const error = new Error('Your registration was not approved. Please contact the IDSC administrator for more information.');
        error.statusCode = 403;
        error.code = 'ACCOUNT_REJECTED';
        throw error;
      }
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
