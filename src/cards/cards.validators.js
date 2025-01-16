const { body, param }  = require("express-validator");

const getCardsBySetValidators = [
  param("idSet").isInt({ min: 1 }).withMessage("L'id du set doit être un entier positif"),
];

const getCardByIdValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const createCardValidators = [
  // Check that the number is not empty and an integer
  body("number")
    .notEmpty().withMessage("Le nombre de la carte est requis")
    .isInt({ min: 1 }).withMessage("Le nombre de la carte doit être un entier positif"),
  // Check that the id_rarity is not empty and an integer
  body("id_rarity")
    .notEmpty().withMessage("L'id de la rareté est requis")
    .isInt({ min: 1 }).withMessage("L'id de la rareté doit être un entier positif"),
  // Check that id_set is not empty and an integer
  body("id_set")
    .notEmpty().withMessage("L'id du set est requis")
    .isInt({ min: 1 }).withMessage("L'id du set doit être un entier positif"),
];

const updateCardValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the number is not empty and an integer (optional)
  body("number")
    .optional()
    .notEmpty().withMessage("Le nombre de la carte est requis")
    .isInt({ min: 1 }).withMessage("Le nombre de la carte doit être un entier positif"),
  // Check that the id_rarity is not empty and an integer (optional)
  body("id_rarity")
    .optional()
    .notEmpty().withMessage("L'id de la rareté est requis")
    .isInt({ min: 1 }).withMessage("L'id de la rareté doit être un entier positif"),
  // Check that id_set is not empty and an integer (optional)
  body("id_set")
    .optional()
    .notEmpty().withMessage("L'id du set est requis")
    .isInt({ min: 1 }).withMessage("L'id du set doit être un entier positif"),
];

const deleteCardValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const addCardToUserValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

const removeCardFromUserValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
];

module.exports = {
  getCardsBySetValidators,
  getCardByIdValidators,
  createCardValidators,
  updateCardValidators,
  deleteCardValidators,
  addCardToUserValidators,
  removeCardFromUserValidators
};
