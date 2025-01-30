const { param } = require("express-validator");

const idValidator = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

module.exports = idValidator;
