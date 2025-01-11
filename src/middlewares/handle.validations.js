const { validationResult } = require("express-validator");
const responseHandler = require("../services/response.handler");

const handleValidations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseHandler(res, 400, "Données manquantes ou invalides", null, errors.array());
  }
  next();
};

module.exports = handleValidations;
