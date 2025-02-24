import { validateUpdateUser, validateUser, validateUserPassword } from "../validators/user.validation.js";

export const userValidator =  (req, res, next) => {
    const { error } =   validateUser.validate(req.body, { abortEarly: false, context: { user: req.user } });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };

// Middleware for password update validation
export const passwordValidator = (req, res, next) => {
   const {error} =  validateUserPassword.validate(req.body,{
    abortEarly: false,
   })
   console.log(error);

   if(error)
    return res.status(400).json({
      success: false,
      error: error.details.map((err) => err.message)
    });

    next();
};


  
  // Middleware for dynamic user update validation
  export const userUpdateValidator =  (req, res, next) => {
    const { error } =  validateUpdateUser.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };
  