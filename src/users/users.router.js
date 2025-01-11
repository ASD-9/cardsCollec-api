const { Router } = require('express');
const router = Router();

const userController = require('./users.controller');

const { getUserByIdValidators, createUserValidators, upateUserValidators, deleteUserValidators } = require("./users.validators");
const handleValidations = require("../middlewares/handle.validations");

router.get("/", userController.getUsers);

router.get("/:id", getUserByIdValidators, handleValidations, userController.getUserById);

router.post("/", createUserValidators, handleValidations, userController.createUser);

router.put("/:id", upateUserValidators, handleValidations, userController.updateUser);

router.delete("/:id", deleteUserValidators, handleValidations, userController.deleteUser);

module.exports = router;
