const { Router } = require('express');
const router = Router();

const setsController = require('./sets.controller');

const idValidator = require("../services/id.validator");
const { getSetsByCollectionValidators, createSetValidators, updateSetValidators } = require("./sets.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

const authorize = require("../middlewares/authorize");

router.get("/", setsController.getSets);

router.get("/:idCollection", getSetsByCollectionValidators, handleValidations, setsController.getSetsByCollection);

router.get("/:id", idValidator, handleValidations, setsController.getSetById);

router.post("/", authorize("Admin"), handleImageUpload, createSetValidators, handleValidations, setsController.createSet);

router.put("/:id", authorize("Admin"), updateSetValidators, handleValidations, setsController.updateSet);

router.delete("/:id", authorize("Admin"), idValidator, handleValidations, setsController.deleteSet);

module.exports = router;
