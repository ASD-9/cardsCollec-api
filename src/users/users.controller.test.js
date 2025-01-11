const usersController = require("./users.controller");
const usersService = require("./users.service");

jest.mock("./users.service"); // Mock the usersService

// Mock users data
const mockUser = {
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

const mockUser2 = {
  "id_user": 2,
  "username": "Jane Doe",
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

describe("Test Users Controller", () => {
  let mockRes;

  // Mock the response before each test
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return a list of users with status 200", async () => {
      const mockUsers = [mockUser, mockUser2];
      usersService.getUsers.mockResolvedValue(mockUsers);

      await usersController.getUsers({}, mockRes);

      expect(usersService.getUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateurs récupérés avec succès",
        data: [mockUser, mockUser2],
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      usersService.getUsers.mockRejectedValue(mockError);

      await usersController.getUsers({}, mockRes);

      expect(usersService.getUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération des utilisateurs",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("getUserById", () => {
    it("should return a user with status 200", async () => {;
      const mockReq = { params: { id: 1 } };
      usersService.getUserById.mockResolvedValue(mockUser);

      await usersController.getUserById(mockReq, mockRes);

      expect(usersService.getUserById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur récupéré avec succès",
        data: mockUser,
        error: null
      });
    });

    it("should return an error with status 404 if user is not found", async () => {
      const mockReq = { params: { id: 99 } };
      usersService.getUserById.mockResolvedValue(null);

      await usersController.getUserById(mockReq, mockRes);

      expect(usersService.getUserById).toHaveBeenCalledWith(99);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Utilisateur non trouvé",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      usersService.getUserById.mockRejectedValue(mockError);

      await usersController.getUserById(mockReq, mockRes);

      expect(usersService.getUserById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération de l'utilisateur",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("createUser", () => {
    it("should return the new user with status 201", async () => {
      const mockReq = { body: {
        username: "John Doe",
        password: "password",
        id_role: 1,
        id_avatar: 1,
      }};
      usersService.createUser.mockResolvedValue(mockUser);

      await usersController.createUser(mockReq, mockRes);

      expect(usersService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur créé avec succès",
        data: mockUser,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: {
        username: "John Doe",
        password: "password",
        id_role: 1,
        id_avatar: 1,
      }};
      const mockError = new Error("Database error");
      usersService.createUser.mockRejectedValue(mockError);

      await usersController.createUser(mockReq, mockRes);

      expect(usersService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la création de l'utilisateur",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("updateUser", () =>  {
    it("should return the updated user with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: {
        username: "John Doe",
        id_avatar: 1,
      }};
      usersService.updateUser.mockResolvedValue(mockUser);

      await usersController.updateUser(mockReq, mockRes);

      expect(usersService.updateUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur mis à jour avec succès",
        data: mockUser,
        error: null
      });
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await usersController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Données manquantes",
        data: null,
        error: null
      });
    });

    it("should return an error with status 404 if user is not found", async () => {
      const mockReq = { params: { id: 99 }, body: {
        username: "John Doe",
        id_avatar: 1,
      }};
      usersService.updateUser.mockResolvedValue(null);

      await usersController.updateUser(mockReq, mockRes);

      expect(usersService.updateUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Utilisateur non trouvé",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: {
        username: "John Doe",
        id_avatar: 1,
      }};
      const mockError = new Error("Database error");
      usersService.updateUser.mockRejectedValue(mockError);

      await usersController.updateUser(mockReq, mockRes);

      expect(usersService.updateUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la mise à jour de l'utilisateur",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("deleteUser", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 } };
      usersService.deleteUser.mockResolvedValue(true);

      await usersController.deleteUser(mockReq, mockRes);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur supprimé avec succès",
        data: null,
        error: null
      });
    });

    it("should return an error with status 404 if user is not found", async () => {
      const mockReq = { params: { id: 99 } };
      usersService.deleteUser.mockResolvedValue(null);

      await usersController.deleteUser(mockReq, mockRes);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Utilisateur non trouvé",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      usersService.deleteUser.mockRejectedValue(mockError);

      await usersController.deleteUser(mockReq, mockRes);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la suppression de l'utilisateur",
        data: null,
        error: Error("Database error")
      });
    });
  })
});
