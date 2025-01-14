const { Router } = require('express');
const router = Router();

const avatarsController = require('./avatars.controller');

const { getAvatarByIdValidators, createAvatarValidators, updateAvatarValidators, deleteAvatarValidators } = require("./avatars.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", avatarsController.getAvatars);

router.get("/:id", getAvatarByIdValidators, handleValidations, avatarsController.getAvatarById);

router.post("/", handleImageUpload, createAvatarValidators, handleValidations, avatarsController.createAvatar);

router.put("/:id", updateAvatarValidators, handleValidations, avatarsController.updateAvatar);

router.delete("/:id", deleteAvatarValidators, handleValidations, avatarsController.deleteAvatar);

module.exports = router;
