const { body } = require("express-validator");

const loginValidators = [
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage("Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir au moins 8 caractères")
];

const refreshTokenValidators = [
  // Check that the refresh token is not empty, a string
  body("refreshToken")
    .trim()
    .notEmpty().withMessage("Le token de rafraîchissement est requis")
    .isString().withMessage("Le token de rafraîchissement doit être une chaîne de caractères")
];

module.exports = {
  loginValidators
};
