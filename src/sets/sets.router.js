const { Router } = require('express');
const router = Router();

const setsController = require('./sets.controller');

const { getSetByIdValidators, createSetValidators, updateSetValidators, deleteSetValidators } = require("./sets.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", setsController.getSets);

router.get("/:id", getSetByIdValidators, handleValidations, setsController.getSetById);

router.post("/", handleImageUpload, createSetValidators, handleValidations, setsController.createSet);

router.put("/:id", updateSetValidators, handleValidations, setsController.updateSet);

router.delete("/:id", deleteSetValidators, handleValidations, setsController.deleteSet);

module.exports = router;
