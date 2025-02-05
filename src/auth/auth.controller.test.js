const authController = require("./auth.controller");
const usersService = require("../users/users.service");
const responseHandler = require("../services/response.handler");
const jwtService = require("../services/jwt.service");
const { comparePassword } = require("../services/hashing");
const jwt = require("jsonwebtoken");

jest.mock("../users/users.service"); // Mock the usersService
jest.mock("../services/response.handler"); // Mock the response handler
jest.mock("../services/jwt.service"); // Mock the jwtService
jest.mock("../services/hashing"); // Mock the hashing
jest.mock("jsonwebtoken"); // Mock the jwt module

// Mock user data
const mockUser = {
  id_user: 1,
  password: "hashedPassword"
}

describe("Test Auth Controller", () => {
  let req;

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    // Set up mocks before each test
    beforeEach(() => {
      req = {
        body: {
          username: "John Doe",
          password: "password"
        }
      };
    });

    it("should return tokens with status 200", async () => {
      usersService.getUserByUsername.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      jwtService.generateAccessToken.mockReturnValue("accessToken");
      jwtService.generateRefreshToken.mockReturnValue("refreshToken");

      await authController.login(req, {});

      expect(usersService.getUserByUsername).toHaveBeenCalledWith("John Doe");
      expect(comparePassword).toHaveBeenCalledWith("password", mockUser.password);
      expect(jwtService.generateAccessToken).toHaveBeenCalledWith(mockUser.id_user);
      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith(mockUser.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Connexion réussie", { accessToken: "accessToken", refreshToken: "refreshToken" });
    });

    it("should return an error with status 401 if user not found", async () => {
      usersService.getUserByUsername.mockResolvedValue(null);

      await authController.login(req, {});

      expect(usersService.getUserByUsername).toHaveBeenCalledWith("John Doe");
      expect(responseHandler).toHaveBeenCalledWith({}, 401, "Identifiants incorrects");
    });

    it("should return an error with status 401 if password is incorrect", async () => {
      usersService.getUserByUsername.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false);

      await authController.login(req, {});

      expect(usersService.getUserByUsername).toHaveBeenCalledWith("John Doe");
      expect(comparePassword).toHaveBeenCalledWith("password", mockUser.password);
      expect(responseHandler).toHaveBeenCalledWith({}, 401, "Identifiants incorrects");
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      usersService.getUserByUsername.mockRejectedValue(mockError);

      await authController.login(req, {});

      expect(usersService.getUserByUsername).toHaveBeenCalledWith("John Doe");
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la connexion", null, mockError);
    });
  });

  describe("refreshToken", () => {
    // Set up mocks before each test
    beforeEach(() => {
      req = {
        body: {
          refreshToken: "refreshToken"
        }
      };
    });

    it("should return tokens with status 200", async () => {
      const decoded = { id_user: 1 };
      jwt.verify.mockImplementation(() => {
        return decoded;
      });
      usersService.getUserRefreshToken.mockResolvedValue("refreshToken");
      jwtService.generateAccessToken.mockReturnValue("accessToken");

      await authController.refreshToken(req, {});

      expect(jwt.verify).toHaveBeenCalledWith(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      expect(usersService.getUserRefreshToken).toHaveBeenCalledWith(decoded.id_user);
      expect(jwtService.generateAccessToken).toHaveBeenCalledWith(mockUser.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Token mis à jour", { accessToken: "accessToken" });
    });

    it("should return an error with status 401 if token is invalid", async () => {
      const decoded = { id_user: 1 };
      jwt.verify.mockImplementation(() => {
        return decoded;
      });
      usersService.getUserRefreshToken.mockResolvedValue("refreshToken2");

      await authController.refreshToken(req, {});

      expect(jwt.verify).toHaveBeenCalledWith(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      expect(usersService.getUserRefreshToken).toHaveBeenCalledWith(decoded.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 401, "Token non valide");
    });

    it("should return an error with status 500", async () => {
      const decoded = { id_user: 1 };
      jwt.verify.mockImplementation(() => {
        return decoded;
      });
      const mockError = new Error("Database error");
      usersService.getUserRefreshToken.mockRejectedValue(mockError);

      await authController.refreshToken(req, {});

      expect(jwt.verify).toHaveBeenCalledWith(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      expect(usersService.getUserRefreshToken).toHaveBeenCalledWith(decoded.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour du token", null, mockError);
    });
  });

  describe("logout", () => {
    // Set up mocks before each test
    beforeEach(() => {
      req = {
        user: {
          id_user: 1
        }
      };
    });

    it("should return status 200", async () => {
      await authController.logout(req, {});

      expect(usersService.updateUser).toHaveBeenCalledWith(req.user.id_user, { refresh_token: null });
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Déconnexion réussie");
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      usersService.updateUser.mockRejectedValue(mockError);

      await authController.logout(req, {});

      expect(usersService.updateUser).toHaveBeenCalledWith(req.user.id_user, { refresh_token: null });
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la déconnexion", null, mockError);
    });
  });

  describe("getProfile", () => {
    // Set up mocks before each test
    beforeEach(() => {
      req = {
        user: {
          id_user: 1
        }
      };
    });

    it("should return a user with status 200", async () => {
      const mockUserData = {
        "id_user": 1,
        "username": "John Doe",
        "password": "password",
        "role": {
          "id_role": 1,
          "name": "Admin"
        },
        "avatar": {
          "id_avatar": 1,
          "name": "Avatar1"
        }
      };
      usersService.getUserById.mockResolvedValue(mockUserData);

      await authController.getProfile(req, {});

      expect(usersService.getUserById).toHaveBeenCalledWith(req.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Utilisateur récupéré avec succès", mockUserData);
    });

    it("should return an error with status 404 if user is not found", async () => {
      usersService.getUserById.mockResolvedValue(null);

      await authController.getProfile(req, {});

      expect(usersService.getUserById).toHaveBeenCalledWith(req.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Utilisateur non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      usersService.getUserById.mockRejectedValue(mockError);

      await authController.getProfile(req, {});

      expect(usersService.getUserById).toHaveBeenCalledWith(req.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération de l'utilisateur", null, Error("Database error"));
    });
  });
});
