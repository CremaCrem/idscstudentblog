const authService = require('../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');
const { getCookieOptions } = require('../utils/jwt');

class AuthController {
  /**
   * Handler for user registration
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      // Validate input payload
      const validation = validateRegisterInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input provided for registration.',
            details: validation.errors,
            timestamp: new Date().toISOString()
          }
        });
      }

      const { user, token } = await authService.registerUser(req.body);

      // Set HTTP-only secure cookie
      res.cookie('token', token, getCookieOptions());

      return res.status(201).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler for user login
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      // Validate input payload
      const validation = validateLoginInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username/email and password are required.',
            details: validation.errors,
            timestamp: new Date().toISOString()
          }
        });
      }

      const { user, token } = await authService.loginUser(req.body);

      // Set HTTP-only secure cookie
      res.cookie('token', token, getCookieOptions());

      return res.status(200).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler for user logout
   * POST /api/v1/auth/logout
   */
  async logout(req, res) {
    res.clearCookie('token', getCookieOptions());
    return res.status(200).json({
      success: true,
      message: 'Successfully logged out.'
    });
  }

  /**
   * Handler for fetching active user session profile
   * GET /api/v1/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.userId);
      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
