const { Router } = require('express');
const router = Router();

const avatarsController = require('./avatars.controller');

const idValidator = require("../services/id.validator");
const { createAvatarValidators, updateAvatarValidators } = require("./avatars.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.get("/", avatarsController.getAvatars);

router.get("/:id", idValidator, handleValidations, avatarsController.getAvatarById);

router.post("/", authenticate, authorize("Admin"), handleImageUpload, createAvatarValidators, handleValidations, avatarsController.createAvatar);

router.put("/:id", authenticate, authorize("Admin"), updateAvatarValidators, handleValidations, avatarsController.updateAvatar);

router.delete("/:id", authenticate, authorize("Admin"), idValidator, handleValidations, avatarsController.deleteAvatar);

module.exports = router;
