const { Router } = require('express');
const router = Router();

const authController = require("./auth.controller");

const { loginValidators, refreshTokenValidators } = require("./auth.validators");
const handleValidations = require("../middlewares/handle.validations");

const authenticate = require("../middlewares/authenticate");

router.post("/login", loginValidators, handleValidations, authController.login);

router.post("/refresh-token", refreshTokenValidators, handleValidations, authController.refreshToken);

router.post("/logout", authenticate, authController.logout);

router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
