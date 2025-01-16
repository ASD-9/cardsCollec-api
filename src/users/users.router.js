const { Router } = require('express');
const router = Router();

const userController = require('./users.controller');

const idValidator = require("../services/id.validator");
const { createUserValidators, upateUserValidators } = require("./users.validators");
const handleValidations = require("../middlewares/handle.validations");

router.get("/", userController.getUsers);

router.get("/:id", idValidator, handleValidations, userController.getUserById);

router.post("/", createUserValidators, handleValidations, userController.createUser);

router.put("/:id", upateUserValidators, handleValidations, userController.updateUser);

router.delete("/:id", idValidator, handleValidations, userController.deleteUser);

module.exports = router;
