const usersService = require("../users/users.service");
const responseHandler = require("../services/response.handler");
const { comparePassword } = require("../services/hashing");
const jwtService = require("../services/jwt.service");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await usersService.getUserByUsername(username);
    if (!user) {
      return responseHandler(res, 401, "Identifiants incorrects");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return responseHandler(res, 401, "Identifiants incorrects");
    }

    const accessToken = jwtService.generateAccessToken(user.id_user);
    const refreshToken = jwtService.generateRefreshToken(user.id_user);

    await usersService.updateUser(user.id_user, { refresh_token: refreshToken });

    return responseHandler(res, 200, "Connexion réussie", { accessToken, refreshToken });
  } catch (error) {
    return responseHandler(res, 500, "Une erreur est survenue lors de la connexion", null, error);
  }
}

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userRefreshToken = await usersService.getUserRefreshToken(decoded.id_user);

    if (!userRefreshToken || userRefreshToken !== refreshToken) {
      return responseHandler(res, 401, "Token non valide");
    }

    const accessToken = jwtService.generateAccessToken(decoded.id_user);

    return responseHandler(res, 200, "Token mis à jour", { accessToken });
  } catch (error) {
    return responseHandler(res, 500, "Une erreur est survenue lors de la mise à jour du token", null, error);
  }
}

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await usersService.updateUser(decoded.id_user, { refresh_token: null });
    return responseHandler(res, 200, "Déconnexion réussie");
  } catch (error) {
    return responseHandler(res, 500, "Une erreur est survenue lors de la déconnexion", null, error);
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.user.id_user);
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

module.exports = {
  login,
  refreshToken,
  logout,
  getProfile
}
