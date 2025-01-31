const usersService = require("../users/users.service");
const responseHandler = require("../services/response.handler");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders?.startsWith("Bearer ")) {
      return responseHandler(res, 401, "Token manquant");
    }

    const token = authHeaders.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const role = await usersService.getUserRole(user.id_user);
    if (!role) {
      return responseHandler(res, 401, "Utilisateur non trouvé");
    }
    user.role = role;

    req.user = user;
    next();
  } catch(error) {
    return responseHandler(res, 401, "Une erreur est survenue lors de l'authentification", null, error);
  }
}

module.exports = authenticate;
