/**
 * Password rule: Minimum 8 characters containing at least 1 number and 1 letter
 * @param {*} password
 * @returns {string|null} Issue message, or null if valid
 */
const getPasswordIssue = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least 1 letter and 1 number.';
  }
  return null;
};

/**
 * Validates registration payload
 * @param {object} body 
 * @returns {{ isValid: boolean, errors: Array<{field: string, issue: string}> }}
 */
const validateRegisterInput = (body) => {
  const { fullName, studentId, username, email, password, termsAccepted } = body || {};
  const errors = [];

  // Full Name validation
  if (!fullName || typeof fullName !== 'string') {
    errors.push({ field: 'fullName', issue: 'Full Name is required.' });
  } else {
    const trimmedFullName = fullName.trim();
    if (trimmedFullName.length < 2 || trimmedFullName.length > 100) {
      errors.push({ field: 'fullName', issue: 'Full Name must be between 2 and 100 characters.' });
    }
  }

  // Student ID validation
  if (!studentId || typeof studentId !== 'string') {
    errors.push({ field: 'studentId', issue: 'Student ID Number is required.' });
  } else if (!studentId.trim()) {
    errors.push({ field: 'studentId', issue: 'Student ID Number cannot be empty.' });
  }

  // Username validation: Alphanumeric (3-20 characters)
  if (!username || typeof username !== 'string') {
    errors.push({ field: 'username', issue: 'Username is required.' });
  } else {
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      errors.push({ field: 'username', issue: 'Username must be between 3 and 20 characters.' });
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.push({ field: 'username', issue: 'Username must be alphanumeric (letters, numbers, underscores).' });
    }
  }

  // Email validation: Valid RFC 5322 pattern
  if (!email || typeof email !== 'string') {
    errors.push({ field: 'email', issue: 'Email address is required.' });
  } else {
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.push({ field: 'email', issue: 'Email must be a valid email address.' });
    }
  }

  const passwordIssue = getPasswordIssue(password);
  if (passwordIssue) {
    errors.push({ field: 'password', issue: passwordIssue });
  }

  // Note: 'role' is intentionally not accepted from client input.
  // All new registrations are hardcoded to 'student' by the service layer.

  // Terms & Privacy Policy acceptance validation
  // Must be boolean true — missing, false, or any other value is rejected.
  if (termsAccepted !== true) {
    errors.push({ field: 'termsAccepted', issue: 'You must accept the Privacy Policy and Terms of Use to register.' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates login payload
 * @param {object} body 
 * @returns {{ isValid: boolean, errors: Array<{field: string, issue: string}> }}
 */
const validateLoginInput = (body) => {
  const { username, email, password } = body || {};
  const errors = [];

  const identifier = username || email;
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    errors.push({ field: 'username', issue: 'Username or email address is required.' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', issue: 'Password is required.' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password reset payload
 * @param {object} body
 * @returns {{ isValid: boolean, errors: Array<{field: string, issue: string}> }}
 */
const validateResetPasswordInput = (body) => {
  const { token, password } = body || {};
  const errors = [];

  if (!token || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    errors.push({ field: 'token', issue: 'Reset token is missing or malformed.' });
  }

  const passwordIssue = getPasswordIssue(password);
  if (passwordIssue) {
    errors.push({ field: 'password', issue: passwordIssue });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateResetPasswordInput
};
