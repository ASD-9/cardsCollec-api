const rolesController = require("./roles.controller");
const rolesService = require("./roles.service");

jest.mock("./roles.service"); // Mock the rolesService

// Mock roles data
const mockRole = {
  id_role: 1,
  name: "Admin"
};

const mockRole2 = {
  id_role: 2,
  name: "User"
};

describe("Test Roles Controller", () => {
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

  describe("getRoles", () => {
    it("should return a list of roles with status 200", async () => {
      const mockRoles = [mockRole, mockRole2];
      rolesService.getRoles.mockResolvedValue(mockRoles);

      await rolesController.getRoles({}, mockRes);

      expect(rolesService.getRoles).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Roles récupérés avec succès",
        data: [mockRole, mockRole2],
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      rolesService.getRoles.mockRejectedValue(mockError);

      await rolesController.getRoles({}, mockRes);

      expect(rolesService.getRoles).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération des roles",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("getRoleById", () => {
    it("should return a role with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      rolesService.getRoleById.mockResolvedValue(mockRole);

      await rolesController.getRoleById(mockReq, mockRes);

      expect(rolesService.getRoleById).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Role récupéré avec succès",
        data: mockRole,
        error: null
      });
    });

    it("should return an error with status 404 if role is not found", async () => {
      const mockReq = { params: { id: 99 } };
      rolesService.getRoleById.mockResolvedValue(null);

      await rolesController.getRoleById(mockReq, mockRes);

      expect(rolesService.getRoleById).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Role non trouvé",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      rolesService.getRoleById.mockRejectedValue(mockError);

      await rolesController.getRoleById(mockReq, mockRes);

      expect(rolesService.getRoleById).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération du role",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("createRole", () => {
    it("should return the new role with status 201", async () => {
      const mockReq = { body: { name: "Admin" } };
      rolesService.createRole.mockResolvedValue(mockRole);

      await rolesController.createRole(mockReq, mockRes); 

      expect(rolesService.createRole).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Role créé avec succès",
        data: mockRole,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: { name: "Admin" } };
      const mockError = new Error("Database error");
      rolesService.createRole.mockRejectedValue(mockError); 

      await rolesController.createRole(mockReq, mockRes); 

      expect(rolesService.createRole).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la création du role",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("updateRole", () => {
    it("should return the updated role with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Admin" } };
      rolesService.updateRole.mockResolvedValue(mockRole);

      await rolesController.updateRole(mockReq, mockRes);

      expect(rolesService.updateRole).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Role mis à jour avec succès",
        data: mockRole,
        error: null
      });
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await rolesController.updateRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Données manquantes",
        data: null,
        error: null
      });
    });

    it("should return an error with status 404 if role is not found", async () => {
      const mockReq = { params: { id: 99 }, body: { name: "Admin" } };
      rolesService.updateRole.mockResolvedValue(null);

      await rolesController.updateRole(mockReq, mockRes);

      expect(rolesService.updateRole).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Role non trouvé",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Admin" } };
      const mockError = new Error("Database error");
      rolesService.updateRole.mockRejectedValue(mockError);

      await rolesController.updateRole(mockReq, mockRes);

      expect(rolesService.updateRole).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la mise à jour du role",
        data: null,
        error: Error("Database error")
      });
    });
  });

  describe("deleteRole", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 } };
      rolesService.deleteRole.mockResolvedValue(true);

      await rolesController.deleteRole(mockReq, mockRes);

      expect(rolesService.deleteRole).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Role supprimé avec succès",
        data: null,
        error: null
      });
    });

    it("should return an error with status 404 if role is not found", async () => {
      const mockReq = { params: { id: 99 } };
      rolesService.deleteRole.mockResolvedValue(null);

      await rolesController.deleteRole(mockReq, mockRes); 

      expect(rolesService.deleteRole).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Role non trouvé",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      rolesService.deleteRole.mockRejectedValue(mockError);

      await rolesController.deleteRole(mockReq, mockRes); 

      expect(rolesService.deleteRole).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la suppression du role",
        data: null,
        error: Error("Database error")
      });
    });
  });
});
