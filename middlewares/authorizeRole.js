import appError from "../utils/appError.js";

export const authorizeRole = (role) => {
  return (req, res, next) => {
    console.log(req.user)
    if (!req.user) {
      return next(new appError("Authentication required!", 401));
    }

    const userRole = req.user.role;

    if (userRole !== role) {
      return next(new appError("Access denied!", 403));
    }

    next(); 
  };
};
