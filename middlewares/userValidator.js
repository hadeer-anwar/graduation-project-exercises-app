import { validateUpdateUser, validateUser, validateUserPassword } from "../validators/user.validation.js";

export const userValidator = async (req, res, next) => {
    const { error } = await  validateUser.validateAsync(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };

// Middleware for password update validation
export const passwordValidator = async (req, res, next) => {
  try {
    // Validate the request body
    await validateUserPassword.validateAsync(req.body, {
      abortEarly: false, // Return all validation errors at once
    });

    // If validation passes, proceed to the next middleware
    next();
  } catch (error) {
    // If validation fails, return a 400 error with the validation errors
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
};


  
  // Middleware for dynamic user update validation
  export const userUpdateValidator = async (req, res, next) => {
    const { error } = await validateUpdateUser.validateAsync(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };
  