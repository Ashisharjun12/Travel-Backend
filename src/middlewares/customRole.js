import createHttpError from "http-errors";

const customrole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createHttpError(403, "you are not allowed to access this resource")
      );
    }
    next();
  };
};


export default customrole;