const { Router } = require('express');
const router = Router();

const rarityController = require('./rarities.controller');

const idValidator = require("../services/id.validator");
const { getRaritiesByCollectionValidators, createRarityValidators, updateRarityValidators } = require("./rarities.validators");
const handleValidations = require("../middlewares/handle.validations");

const authorize = require("../middlewares/authorize");

router.get("/", rarityController.getRarities);

router.get("/:idCollection", getRaritiesByCollectionValidators, handleValidations, rarityController.getRaritiesByCollection);

router.get("/:id", idValidator, handleValidations, rarityController.getRarityById);

router.post("/", authorize("Admin"), createRarityValidators, handleValidations, rarityController.createRarity);

router.put("/:id", authorize("Admin"), updateRarityValidators, handleValidations, rarityController.updateRarity);

router.delete("/:id", authorize("Admin"), idValidator, handleValidations, rarityController.deleteRarity);

module.exports = router;
