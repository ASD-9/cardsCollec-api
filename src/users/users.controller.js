const userService = require("./users.service");
const responseHandler = require("../services/response.handler");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    responseHandler(res, 200, "Utilisateurs récupérés avec succès", users);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des utilisateurs", null, error);
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    // Check if user is found
    if (!user) {
      responseHandler(res, 404, "Utilisateur non trouvé");
    } else {
      responseHandler(res, 200, "Utilisateur récupéré avec succès", user);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération de l'utilisateur", null, error);
  }
}

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    responseHandler(res, 201, "Utilisateur créé avec succès", user);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création de l'utilisateur", null, error);
  }
}

const updateUser = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    // Check if user is found
    if (!user) {
      responseHandler(res, 404, "Utilisateur non trouvé");
    } else {
      responseHandler(res, 200, "Utilisateur mis à jour avec succès", user);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour de l'utilisateur", null, error);
  }
}

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    // Check if user is found
    if (!result) {
      responseHandler(res, 404, "Utilisateur non trouvé");
    } else {
      responseHandler(res, 200, "Utilisateur supprimé avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression de l'utilisateur", null, error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}
