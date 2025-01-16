const { Router } = require('express');
const router = Router();

const collectionsController = require('./collections.controller');

const idValidator = require("../services/id.validator");
const { createCollectionValidators, updateCollectionValidators } = require("./collections.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", collectionsController.getCollections);

router.get("/:id", idValidator, handleValidations, collectionsController.getCollectionById);

router.post("/", handleImageUpload, createCollectionValidators, handleValidations, collectionsController.createCollection);

router.put("/:id", updateCollectionValidators, handleValidations, collectionsController.updateCollection);

router.delete("/:id", idValidator, handleValidations, collectionsController.deleteCollection);

module.exports = router;
