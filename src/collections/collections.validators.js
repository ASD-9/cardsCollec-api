const { body, param } = require("express-validator");

const createCollectionValidators = [
  // Check that the name is not empty, a string and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom de la collection est requis")
    .isString().withMessage("Le nom de la collection doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom de la collection doit avoir au moins 3 caractères"),
];

const updateCollectionValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the name is not empty, a string and at least 3 characters long (optional)
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Le nom de la collection est requis")
    .isString().withMessage("Le nom de la collection doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom de la collection doit avoir au moins 3 caractères"),
];

module.exports = {
  createCollectionValidators,
  updateCollectionValidators
};
