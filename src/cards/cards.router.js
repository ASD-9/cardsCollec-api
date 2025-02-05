const { Router } = require('express');
const router = Router();

const cardsController = require('./cards.controller');

const idValidator = require("../services/id.validator");
const { getCardsBySetValidators, createCardValidators, updateCardValidators } = require("./cards.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

const authorize = require("../middlewares/authorize");

router.get("/", cardsController.getCards);

router.get("/:idSet", getCardsBySetValidators, handleValidations, cardsController.getCardsBySet);

router.get("/:id", idValidator, handleValidations, cardsController.getCardById);

router.post("/", authorize("Admin"), handleImageUpload, createCardValidators, handleValidations, cardsController.createCard);

router.put("/:id", authorize("Admin"), updateCardValidators, handleValidations, cardsController.updateCard);

router.delete("/:id", authorize("Admin"), idValidator, handleValidations, cardsController.deleteCard);

router.post("/add-to-user/:id", idValidator, handleValidations, cardsController.addCardToUser);

router.delete("/remove-from-user/:id", idValidator, handleValidations, cardsController.removeCardFromUser);

module.exports = router;
