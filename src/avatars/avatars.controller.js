const avatarsService = require("./avatars.service");
const responseHandler = require("../services/response.handler");

const getAvatars = async (req, res) => {
  try {
    const avatars = await avatarsService.getAvatars();
    responseHandler(res, 200, "Avatars récupérés avec succès", avatars);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des avatars", null, error);
  }
}

const getAvatarById = async (req, res) => {
  try {
    const avatar = await avatarsService.getAvatarById(req.params.id);
    // Check if avatar is found
    if (!avatar) {
      responseHandler(res, 404, "Avatar non trouvé");
    } else {
      responseHandler(res, 200, "Avatar récupéré avec succès", avatar);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération de l'avatar", null, error);
  }
}

const createAvatar = async (req, res) => {
  try {
    const avatar = await avatarsService.createAvatar(req.body);
    responseHandler(res, 201, "Avatar créé avec succès", avatar);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création de l'avatar", null, error);
  }
}

const updateAvatar = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const avatar = await avatarsService.updateAvatar(req.params.id, req.body);
    // Check if avatar is found
    if (!avatar) {
      responseHandler(res, 404, "Avatar non trouvé");
    } else {
      responseHandler(res, 200, "Avatar mis à jour avec succès", avatar);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour de l'avatar", null, error);
  }
}

const deleteAvatar = async (req, res) => {
  try {
    const result = await avatarsService.deleteAvatar(req.params.id);
    // Check if avatar is found
    if (!result) {
      responseHandler(res, 404, "Avatar non trouvé");
    } else {
      responseHandler(res, 200, "Avatar supprimé avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression de l'avatar", null, error);
  }
}

module.exports = {
  getAvatars,
  getAvatarById,
  createAvatar,
  updateAvatar,
  deleteAvatar
};
