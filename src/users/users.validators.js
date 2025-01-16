const { body, param } = require("express-validator");

const createUserValidators = [
  // Check that the username is not empty, a string, and at least 3 characters long
  body("username")
    .trim()
    .notEmpty().withMessage("Le nom d'utilisateur est requis")
    .isString().withMessage("Le nom d'utilisateur doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom d'utilisateur doit avoir au moins 3 caractères"),
  // Check that the password is not empty, a string, and at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)
  body("password")
    .notEmpty().withMessage("Le mot de passe est requis")
    .isString().withMessage("Le mot de passe doit être une chaîne de caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir au moins 8 caractères"),
  body("id_role").isInt({ min: 1 }).withMessage("L'id du rôle doit être un entier positif"),
  body("id_avatar").isInt({ min: 1 }).withMessage("L'id de l'avatar doit être un entier positif"),
];

const upateUserValidators = [
  param("id").isInt({ min: 1 }).withMessage("L'id doit être un entier positif"),
  // Check that the username is not empty, a string, and at least 3 characters long (optional)
  body("username")
    .optional()
    .trim()
    .notEmpty().withMessage("Le nom d'utilisateur est requis")
    .isString().withMessage("Le nom d'utilisateur doit être une chaîne de caractères")
    .isLength({ min: 3 }).withMessage("Le nom d'utilisateur doit avoir au moins 3 caractères"),
  // Check that the password is not empty, a string, and at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&) (optional)
  body("password")
    .optional()
    .notEmpty().withMessage("Le mot de passe est requis")
    .isString().withMessage("Le mot de passe doit être une chaîne de caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir au moins 8 caractères"),
  body("id_role").optional().isInt({ min: 1 }).withMessage("L'id du rôle doit être un entier positif"),
  body("id_avatar").optional().isInt({ min: 1 }).withMessage("L'id de l'avatar doit être un entier positif"),
];

module.exports = {
  createUserValidators,
  upateUserValidators
};
