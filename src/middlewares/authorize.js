const responseHandler = require("../services/response.handler");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      return responseHandler(res, 403, "Accès non autorisé");
    }
    next();
  }
};

module.exports = authorize;
