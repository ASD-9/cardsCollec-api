const { Router } = require('express');
const router = Router();

const setsController = require('./sets.controller');

const idValidator = require("../services/id.validator");
const { getSetsByCollectionValidators, createSetValidators, updateSetValidators } = require("./sets.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", setsController.getSets);

router.get("/:idCollection", getSetsByCollectionValidators, handleValidations, setsController.getSetsByCollection);

router.get("/:id", idValidator, handleValidations, setsController.getSetById);

router.post("/", handleImageUpload, createSetValidators, handleValidations, setsController.createSet);

router.put("/:id", updateSetValidators, handleValidations, setsController.updateSet);

router.delete("/:id", idValidator, handleValidations, setsController.deleteSet);

module.exports = router;
