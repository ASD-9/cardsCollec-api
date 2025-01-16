const { Router } = require('express');
const router = Router();

const cardsController = require('./cards.controller');

const { getCardsBySetValidators, getCardByIdValidators, createCardValidators, updateCardValidators, deleteCardValidators, addCardToUserValidators, removeCardFromUserValidators } = require("./cards.validators");
const handleValidations = require("../middlewares/handle.validations");
const handleImageUpload = require("../middlewares/upload");

router.get("/", cardsController.getCards);

router.get("/:idSet", getCardsBySetValidators, handleValidations, cardsController.getCardsBySet);

router.get("/:id", getCardByIdValidators, handleValidations, cardsController.getCardById);

router.post("/", handleImageUpload, createCardValidators, handleValidations, cardsController.createCard);

router.put("/:id", updateCardValidators, handleValidations, cardsController.updateCard);

router.delete("/:id", deleteCardValidators, handleValidations, cardsController.deleteCard);

router.post("/add-to-user/:id", addCardToUserValidators, handleValidations, cardsController.addCardToUser);

router.delete("/remove-from-user/:id", removeCardFromUserValidators, handleValidations, cardsController.removeCardFromUser);

module.exports = router;
