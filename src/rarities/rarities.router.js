const { Router } = require('express');
const router = Router();

const rarityController = require('./rarities.controller');

const { getRaritiesByCollectionValidators, getRarityByIdValidators, createRarityValidators, upateRarityValidators, deleteRarityValidators, updateRarityValidators } = require("./rarities.validators");
const handleValidations = require("../middlewares/handle.validations");

router.get("/", rarityController.getRarities);

router.get("/:idCollection", getRaritiesByCollectionValidators, handleValidations, rarityController.getRaritiesByCollection);

router.get("/:id", getRarityByIdValidators, handleValidations, rarityController.getRarityById);

router.post("/", createRarityValidators, handleValidations, rarityController.createRarity);

router.put("/:id", updateRarityValidators, handleValidations, rarityController.updateRarity);

router.delete("/:id", deleteRarityValidators, handleValidations, rarityController.deleteRarity);

module.exports = router;
