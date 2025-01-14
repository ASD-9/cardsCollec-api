const collectionsService = require("./collections.service");
const responseHandler = require("../services/response.handler");

const getCollections = async (req, res) => {
  try {
    const collections = await collectionsService.getCollections();
    responseHandler(res, 200, "Collections récupérées avec succès", collections);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des collections", null, error);
  }
}

const getCollectionById = async (req, res) => {
  try {
    const collection = await collectionsService.getCollectionById(req.params.id);
    // Check if collection is found
    if (!collection) {
      responseHandler(res, 404, "Collection non trouvée");
    } else {
      responseHandler(res, 200, "Collection récupérée avec succès", collection);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération de la collection", null, error);
  }
}

const createCollection = async (req, res) => {
  try {
    const collection = await collectionsService.createCollection(req.body);
    responseHandler(res, 201, "Collection créée avec succès", collection);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création de la collection", null, error);
  }
}

const updateCollection = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const collection = await collectionsService.updateCollection(req.params.id, req.body);
    // Check if collection is found
    if (!collection) {
      responseHandler(res, 404, "Collection non trouvée");
    } else {
      responseHandler(res, 200, "Collection mise à jour avec succès", collection);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour de la collection", null, error);
  }
}

const deleteCollection = async (req, res) => {
  try {
    const collection = await collectionsService.deleteCollection(req.params.id);
    // Check if collection is found
    if (!collection) {
      responseHandler(res, 404, "Collection non trouvée");
    } else {
      responseHandler(res, 200, "Collection supprimée avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression de la collection", null, error);
  }
}

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
