/**
 * Client-side input validation utilities
 * These complement server-side validation for better UX
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  },

  /**
   * Validate password strength
   * Requires: minimum 8 characters, at least one letter, one number
   */
  password: (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  },

  /**
   * Validate password match
   */
  passwordMatch: (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  },

  /**
   * Validate full name
   */
  fullName: (name) => {
    if (!name || name.trim().length < 2) return "Full name must be at least 2 characters";
    if (name.length > 150) return "Full name must not exceed 150 characters";
    return null;
  },

  /**
   * Validate verification code (6 digits)
   */
  verificationCode: (code) => {
    if (!code) return "Verification code is required";
    if (!/^\d{6}$/.test(code)) return "Verification code must be exactly 6 digits";
    return null;
  },
};

export function getPasswordChecks(password = "") {
  return [
    {
      id: "length",
      label: "At least 8 characters",
      passed: password.length >= 8,
      required: true,
    },
    {
      id: "letter",
      label: "Contains a letter",
      passed: /[a-zA-Z]/.test(password),
      required: true,
    },
    {
      id: "number",
      label: "Contains a number",
      passed: /[0-9]/.test(password),
      required: true,
    },
    {
      id: "special",
      label: "Contains a special character",
      passed: /[^A-Za-z0-9]/.test(password),
      required: false,
    },
  ];
}

export function getPasswordStrength(password = "") {
  if (!password) {
    return {
      label: "None",
      colorClass: "strength-label strength-none",
      meterClass: "strength-fill-none",
      width: "0%",
    };
  }

  const scoreParts = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = scoreParts.filter(Boolean).length;

  if (score <= 2) {
    return {
      label: "Weak",
      colorClass: "strength-label strength-weak",
      meterClass: "strength-fill-weak",
      width: "35%",
    };
  }
  if (score <= 4) {
    return {
      label: "Medium",
      colorClass: "strength-label strength-medium",
      meterClass: "strength-fill-medium",
      width: "65%",
    };
  }
  return {
    label: "Strong",
    colorClass: "strength-label strength-strong",
    meterClass: "strength-fill-strong",
    width: "100%",
  };
}

/**
 * Validate email with multiple checks
 */
export function validateEmail(email) {
  return validators.email(email);
}

/**
 * Validate password with strength requirements
 */
export function validatePassword(password) {
  return validators.password(password);
}

/**
 * Validate form data (returns all errors)
 */
export function validateForm(data, schema) {
  const errors = {};

  for (const [field, validator] of Object.entries(schema)) {
    if (typeof validator === "function") {
      const error = validator(data[field]);
      if (error) {
        errors[field] = error;
      }
    }
  }

  return errors;
}

/**
 * Check if form has any validation errors
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
