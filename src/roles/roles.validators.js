const { body, param } = require("express-validator");

const createRoleValidators = [
  // Check that the name is not empty, a string, and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom du rôle est requis")
    .isString().withMessage("Le nom du rôle doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom du rôle doit avoir au moins 3 caractères"),
];

const updateRoleValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the name is not empty, a string, and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom du rôle est requis")
    .isString().withMessage("Le nom du rôle doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom du rôle doit avoir au moins 3 caractères"),
];

module.exports = {
  createRoleValidators,
  updateRoleValidators
};
