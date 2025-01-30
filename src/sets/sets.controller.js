const setsService = require("./sets.service");
const responseHandler = require("../services/response.handler");

const getSets = async (req, res) => {
  try {
    const sets = await setsService.getSets();
    responseHandler(res, 200, "Sets récupérés avec succès", sets);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des sets", null, error);
  }
}

const getSetsByCollection = async (req, res) => {
  try {
    const sets = await setsService.getSetsByCollection(req.params.idCollection);
    responseHandler(res, 200, "Sets récupérés avec succès", sets);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des sets", null, error);
  }
}

const getSetById = async (req, res) => {
  try {
    const set = await setsService.getSetById(req.params.id);
    // Check if set is found
    if (!set) {
      responseHandler(res, 404, "Set non trouvé");
    }
    responseHandler(res, 200, "Set récupéré avec succès", set);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération du set", null, error);
  }
}

const createSet = async (req, res) => {
  try {
    const set = await setsService.createSet(req.body);
    responseHandler(res, 201, "Set créé avec succès", set);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création du set", null, error);
  }
};

const updateSet = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const set = await setsService.updateSet(req.params.id, req.body);
    // Check if set is found
    if (!set) {
      responseHandler(res, 404, "Set non trouvé");
    } else {
      responseHandler(res, 200, "Set mis à jour avec succès", set);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour du set", null, error);
  }
}

const deleteSet = async (req, res) => {
  try {
    const set = await setsService.deleteSet(req.params.id);
    // Check if set is found
    if (!set) {
      responseHandler(res, 404, "Set non trouvé");
    } else {
      responseHandler(res, 200, "Set supprimé avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression du set", null, error);
  }
}

module.exports = {
  getSets,
  getSetsByCollection,
  getSetById,
  createSet,
  updateSet,
  deleteSet
};
