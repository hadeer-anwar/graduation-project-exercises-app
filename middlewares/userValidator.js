import { validateUpdateUser, validateUser, validateUserPassword } from "../validators/user.validation.js";

export const userValidator = (req, res, next) => {
    const { error } =  validateUser.validateAsync(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };

// Middleware for password update validation
export const passwordValidator = (req, res, next) => {
    const { error } = validateUserPassword.validateAsync(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };
  
  // Middleware for dynamic user update validation
  export const userUpdateValidator = (req, res, next) => {
    const { error } = validateUpdateUser.validateAsync(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };
  