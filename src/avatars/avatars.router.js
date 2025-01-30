const { Router } = require('express');
const router = Router();

const avatarsController = require('./avatars.controller');

const idValidator = require("../services/id.validator");
const { createAvatarValidators, updateAvatarValidators } = require("./avatars.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", avatarsController.getAvatars);

router.get("/:id", idValidator, handleValidations, avatarsController.getAvatarById);

router.post("/", handleImageUpload, createAvatarValidators, handleValidations, avatarsController.createAvatar);

router.put("/:id", updateAvatarValidators, handleValidations, avatarsController.updateAvatar);

router.delete("/:id", idValidator, handleValidations, avatarsController.deleteAvatar);

module.exports = router;
