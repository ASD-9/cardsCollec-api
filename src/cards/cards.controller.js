const cardsService = require("./cards.service");
const responseHandler = require("../services/response.handler");

const getCards = async (req, res) => {
  try {
    const cards = await cardsService.getCards(req.user.id_user);
    responseHandler(res, 200, "Cartes récupérées avec succès", cards);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des cartes", null, error);
  }
}

const getCardsBySet = async (req, res) => {
  try {
    const cards = await cardsService.getCardsBySet(req.user.id_user, req.params.idSet);
    responseHandler(res, 200, "Cartes récupérées avec succès", cards);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des cartes", null, error);
  }
}

const getCardById = async (req, res) => {
  try {
    const card = await cardsService.getCardById(req.params.id, req.user.id_user);
    // Check if card is found
    if (!card) {
      responseHandler(res, 404, "Carte non trouvée");
    }
    responseHandler(res, 200, "Carte récupérée avec succès", card);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération de la carte", null, error);
  }
}

const createCard = async (req, res) => {
  try {
    const card = await cardsService.createCard(req.body);
    responseHandler(res, 201, "Carte crée avec succès", card);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création de la carte", null, error);
  }
}

const updateCard = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const card = await cardsService.updateCard(req.params.id, req.user.id_user, req.body);
    // Check if card is found
    if (!card) {
      responseHandler(res, 404, "Carte non trouvée");
    } else {
      responseHandler(res, 200, "Carte mise à jour avec succès", card);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour de la carte", null, error);
  }
}

const deleteCard = async (req, res) => {
  try {
    const result = await cardsService.deleteCard(req.params.id);
    // Check if card is found
    if (!result) {
      responseHandler(res, 404, "Carte non trouvée");
    } else {
      responseHandler(res, 200, "Carte supprimée avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression de la carte", null, error);
  }
}

const addCardToUser = async (req, res) => {
  try {
    const card = await cardsService.addCardToUser(req.params.id, req.user.id_user);
    responseHandler(res, 200, "Carte ajoutée à l'utilisateur avec succès", card);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de l'ajout de la carte à l'utilisateur", null, error);
  }
}

const removeCardFromUser = async (req, res) => {
  try {
    const card = await cardsService.removeCardFromUser(req.params.id, req.user.id_user);
    responseHandler(res, 200, "Carte supprimée de l'utilisateur avec succès", card);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression de la carte de l'utilisateur", null, error);
  }
}

module.exports = {
  getCards,
  getCardsBySet,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  addCardToUser,
  removeCardFromUser
};
