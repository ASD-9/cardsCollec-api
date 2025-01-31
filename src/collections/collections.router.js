const { Router } = require('express');
const router = Router();

const collectionsController = require('./collections.controller');

const idValidator = require("../services/id.validator");
const { createCollectionValidators, updateCollectionValidators } = require("./collections.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

const authorize = require("../middlewares/authorize");

router.get("/", collectionsController.getCollections);

router.get("/:id", idValidator, handleValidations, collectionsController.getCollectionById);

router.post("/", authorize("Admin"), handleImageUpload, createCollectionValidators, handleValidations, collectionsController.createCollection);

router.put("/:id", authorize("Admin"), updateCollectionValidators, handleValidations, collectionsController.updateCollection);

router.delete("/:id", authorize("Admin"), idValidator, handleValidations, collectionsController.deleteCollection);

module.exports = router;
