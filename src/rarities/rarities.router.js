const { Router } = require('express');
const router = Router();

const rarityController = require('./rarities.controller');

const idValidator = require("../services/id.validator");
const { getRaritiesByCollectionValidators, createRarityValidators, updateRarityValidators } = require("./rarities.validators");
const handleValidations = require("../middlewares/handle.validations");

router.get("/", rarityController.getRarities);

router.get("/:idCollection", getRaritiesByCollectionValidators, handleValidations, rarityController.getRaritiesByCollection);

router.get("/:id", idValidator, handleValidations, rarityController.getRarityById);

router.post("/", createRarityValidators, handleValidations, rarityController.createRarity);

router.put("/:id", updateRarityValidators, handleValidations, rarityController.updateRarity);

router.delete("/:id", idValidator, handleValidations, rarityController.deleteRarity);

module.exports = router;
