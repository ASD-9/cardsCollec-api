const { body, param } = require("express-validator");

const getSetsByCollectionValidators = [
  param("idCollection").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const getSetByIdValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const createSetValidators = [
  // Check that the name is not empty, a string and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom du set est requis")
    .isString().withMessage("Le nom du set doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom du set doit avoir au moins 3 caractères"),
  // Check that the id_collection is not empty and an integer
  body("id_collection")
    .notEmpty().withMessage("L'id de la collection est requis")
    .isInt({ min: 1 }).withMessage("L'id de la collection doit être un entier positif"),
];

const updateSetValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the name is not empty, a string and at least 3 characters long
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom du set est requis")
    .isString().withMessage("Le nom du set doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom du set doit avoir au moins 3 caractères"),
];

const deleteSetValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

module.exports = {
  getSetsByCollectionValidators,
  getSetByIdValidators,
  createSetValidators,
  updateSetValidators,
  deleteSetValidators
};
