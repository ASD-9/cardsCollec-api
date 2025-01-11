const { body, param } = require("express-validator");

const getRaritiesByCollectionValidators = [
  param("idCollection").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const getRarityByIdValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const createRarityValidators = [
  // Check that the name is not empty and a string
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom de la rareté est requis")
    .isString().withMessage("Le nom de la rareté doit être une chaîne de caractères"),
  // Check that the abbreviated_name is not empty, a string and at most 5 characters long
  body("abbreviated_name")
    .trim()
    .notEmpty().withMessage("Le nom abrégé de la rareté est requis")
    .isString().withMessage("Le nom abrégé de la rareté doit être une chaîne de caractères")
    .isLength({ max: 5 }).withMessage("Le nom abrégé de la rareté doit avoir au maximum 5 caractères"),
  // Check that the rank is not empty and an integer
  body("rank")
    .notEmpty().withMessage("Le rang de la rareté est requis")
    .isInt({ min: 1 }).withMessage("Le rang de la rareté doit être un entier positif"),
  // Check that the id_collection is not empty and an integer
  body("id_collection")
    .notEmpty().withMessage("L'id de la collection est requis")
    .isInt({ min: 1 }).withMessage("L'id de la collection doit être un entier positif"),
];

const updateRarityValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the name is not empty and a string (optional)
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Le nom de la rareté est requis")
    .isString().withMessage("Le nom de la rareté doit être une chaîne de caractères"),
  // Check that the abbreviated_name is not empty, a string and at most 5 characters long (optional)
  body("abbreviated_name")
    .optional()
    .trim()
    .notEmpty().withMessage("Le nom abrégé de la rareté est requis")
    .isString().withMessage("Le nom abrégé de la rareté doit être une chaîne de caractères")
    .isLength({ max: 5 }).withMessage("Le nom abrégé de la rareté doit avoir au maximum 5 caractères"),
  // Check that the rank is not empty and an integer (optional)
  body("rank")
    .optional()
    .notEmpty().withMessage("Le rang de la rareté est requis")
    .isInt({ min: 1 }).withMessage("Le rang de la rareté doit être un entier positif"),
  // Check that the id_collection is not empty and an integer (optional)
  body("id_collection")
    .optional()
    .notEmpty().withMessage("L'id de la collection est requis")
    .isInt({ min: 1 }).withMessage("L'id de la collection doit être un entier positif"),
];

const deleteRarityValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

module.exports = {
  getRaritiesByCollectionValidators,
  getRarityByIdValidators,
  createRarityValidators,
  updateRarityValidators,
  deleteRarityValidators
};
