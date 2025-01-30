const raritiesService = require("./rarities.service");
const responseHandler = require("../services/response.handler");

const getRarities = async (req, res) => {
  try {
    const rarities = await raritiesService.getRarities();
    responseHandler(res, 200, "Raretés récupérées avec succès", rarities);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des raretés", null, error);
  }
}

const getRaritiesByCollection = async (req, res) => {
  try {
    const rarities = await raritiesService.getRaritiesByCollection(req.params.idCollection);
    responseHandler(res, 200, "Raretés récupérées avec succès", rarities);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des raretés", null, error);
  }
}

const getRarityById = async (req, res) => {
  try {
    const rarity = await raritiesService.getRarityById(req.params.id);
    // Check if rarity is found
    if (!rarity) {
      responseHandler(res, 404, "Rareté non trouvée");
    } else {
      responseHandler(res, 200, "Rareté récupérée avec succès", rarity);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération de la rareté", null, error);
  }
}

const createRarity = async (req, res) => {
  try {
    const rarity = await raritiesService.createRarity(req.body);
    responseHandler(res, 201, "Rareté créée avec succès", rarity);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création de la rareté", null, error);
  }
}

const updateRarity = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const rarity = await raritiesService.updateRarity(req.params.id, req.body);
    // Check if rarity is found
    if (!rarity) {
      responseHandler(res, 404, "Rareté non trouvée");
    } else {
      responseHandler(res, 200, "Rareté mise à jour avec succès", rarity);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour de la rareté", null, error);
  }
}

const deleteRarity = async (req, res) => {
  try {
    const result = await raritiesService.deleteRarity(req.params.id);
    // Check if rarity is found
    if (!result) {
      responseHandler(res, 404, "Rareté non trouvée");
    } else {
      responseHandler(res, 200, "Rareté supprimée avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression de la rareté", null, error);
  }
}

module.exports = {
  getRarities,
  getRaritiesByCollection,
  getRarityById,
  createRarity,
  updateRarity,
  deleteRarity
}
