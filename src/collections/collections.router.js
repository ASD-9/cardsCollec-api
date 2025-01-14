const { Router } = require('express');
const router = Router();

const collectionsController = require('./collections.controller');

const { getCollectionByIdValidators, createCollectionValidators, updateCollectionValidators, deleteCollectionValidators } = require("./collections.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", collectionsController.getCollections);

router.get("/:id", getCollectionByIdValidators, handleValidations, collectionsController.getCollectionById);

router.post("/", handleImageUpload, createCollectionValidators, handleValidations, collectionsController.createCollection);

router.put("/:id", updateCollectionValidators, handleValidations, collectionsController.updateCollection);

router.delete("/:id", deleteCollectionValidators, handleValidations, collectionsController.deleteCollection);

module.exports = router;
