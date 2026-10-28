const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware: Validates JWT Access Token on protected endpoints
 */
const authGuard = async (req, res, next) => {
  let decoded;
  try {
    let token;

    // Check Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check HTTP-only cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied. Authentication token is missing.',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Verify token validity
    decoded = verifyToken(token);
  } catch (error) {
    return rejectToken(res);
  }

  // Reject tokens for deleted accounts or issued before the last password change
  let user;
  try {
    user = await User.findById(decoded.userId).select('passwordChangedAt').lean();
  } catch (error) {
    return next(error); // DB failure is a 500, not a reason to log the user out
  }
  if (!user || (user.passwordChangedAt && decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000))) {
    return rejectToken(res);
  }

  req.user = decoded; // { userId, username, role }
  next();
};

const rejectToken = (res) => {
  return res.status(401).json({
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired authentication token.',
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Middleware: Enforces Role-Based Access Control (RBAC)
 * @param {...string} roles Allowed roles (e.g. 'student', 'admin')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied. Elevated administrative privileges are required.',
          timestamp: new Date().toISOString()
        }
      });
    }
    next();
  };
};

module.exports = {
  authGuard,
  authorizeRoles
};
