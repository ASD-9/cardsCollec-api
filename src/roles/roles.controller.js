const rolesService = require("./roles.service");
const responseHandler = require("../services/response.handler");

const getRoles = async (req, res) => {
  try {
    const roles = await rolesService.getRoles();
    responseHandler(res, 200, "Roles récupérés avec succès", roles);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération des roles", null, error);
  }
}

const getRoleById = async (req, res) => {
  try {
    const role = await rolesService.getRoleById(req.params.id);
    // Check if role is found
    if (!role) {
      responseHandler(res, 404, "Role non trouvé");
    } else {
      responseHandler(res, 200, "Role récupéré avec succès", role);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la récupération du role", null, error);
  }
}

const createRole = async (req, res) => {
  try {
    const role = await rolesService.createRole(req.body);
    responseHandler(res, 201, "Role créé avec succès", role);
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la création du role", null, error);
  }
}

const updateRole = async (req, res) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return responseHandler(res, 400, "Données manquantes");
  }
  
  try {
    const role = await rolesService.updateRole(req.params.id, req.body);
    // Check if role is found
    if (!role) {
      responseHandler(res, 404, "Role non trouvé");
    } else {
      responseHandler(res, 200, "Role mis à jour avec succès", role);
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour du role", null, error);
  }
}

const deleteRole = async (req, res) => {
  try {
    const result = await rolesService.deleteRole(req.params.id);
    // Check if role is found
    if (!result) {
      responseHandler(res, 404, "Role non trouvé");
    } else {
      responseHandler(res, 200, "Role supprimé avec succès");
    }
  } catch (error) {
    responseHandler(res, 500, "Une erreur est survenue lors de la suppression du role", null, error);
  }
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
}
