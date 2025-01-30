const { body, param } = require("express-validator");

const createAvatarValidators = [
  // Check that the name is not empty, a string and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom de l'avatar est requis")
    .isString().withMessage("Le nom de l'avatar doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom de l'avatar doit avoir au moins 3 caractères"),
];

const updateAvatarValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the name is not empty, a string and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom de l'avatar est requis")
    .isString().withMessage("Le nom de l'avatar doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom de l'avatar doit avoir au moins 3 caractères"),
];

module.exports = {
  createAvatarValidators,
  updateAvatarValidators
};
