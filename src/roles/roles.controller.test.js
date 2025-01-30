const rolesController = require("./roles.controller");
const rolesService = require("./roles.service");
const responseHandler = require("../services/response.handler");

jest.mock("./roles.service"); // Mock the rolesService
jest.mock("../services/response.handler"); // Mock the response handler

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
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getRoles", () => {
    it("should return a list of roles with status 200", async () => {
      const mockRoles = [mockRole, mockRole2];
      rolesService.getRoles.mockResolvedValue(mockRoles);

      await rolesController.getRoles({}, {});

      expect(rolesService.getRoles).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Roles récupérés avec succès", mockRoles);
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      rolesService.getRoles.mockRejectedValue(mockError);

      await rolesController.getRoles({}, {});

      expect(rolesService.getRoles).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des roles", null, mockError);
    });
  });

  describe("getRoleById", () => {
    it("should return a role with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      rolesService.getRoleById.mockResolvedValue(mockRole);

      await rolesController.getRoleById(mockReq, {});

      expect(rolesService.getRoleById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Role récupéré avec succès", mockRole);
    });

    it("should return an error with status 404 if role is not found", async () => {
      const mockReq = { params: { id: 99 } };
      rolesService.getRoleById.mockResolvedValue(null);

      await rolesController.getRoleById(mockReq, {});

      expect(rolesService.getRoleById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Role non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      rolesService.getRoleById.mockRejectedValue(mockError);

      await rolesController.getRoleById(mockReq, {});

      expect(rolesService.getRoleById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération du role", null, mockError);
    });
  });

  describe("createRole", () => {
    it("should return the new role with status 201", async () => {
      const mockReq = { body: { name: "Admin" } };
      rolesService.createRole.mockResolvedValue(mockRole);

      await rolesController.createRole(mockReq, {}); 

      expect(rolesService.createRole).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 201, "Role créé avec succès", mockRole);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: { name: "Admin" } };
      const mockError = new Error("Database error");
      rolesService.createRole.mockRejectedValue(mockError); 

      await rolesController.createRole(mockReq, {}); 

      expect(rolesService.createRole).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la création du role", null, mockError);
    });
  });

  describe("updateRole", () => {
    it("should return the updated role with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Admin" } };
      rolesService.updateRole.mockResolvedValue(mockRole);

      await rolesController.updateRole(mockReq, {});

      expect(rolesService.updateRole).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Role mis à jour avec succès", mockRole);
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await rolesController.updateRole(mockReq, {});

      expect(rolesService.updateRole).not.toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 400, "Données manquantes");
    });

    it("should return an error with status 404 if role is not found", async () => {
      const mockReq = { params: { id: 99 }, body: { name: "Admin" } };
      rolesService.updateRole.mockResolvedValue(null);

      await rolesController.updateRole(mockReq, {});

      expect(rolesService.updateRole).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Role non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Admin" } };
      const mockError = new Error("Database error");
      rolesService.updateRole.mockRejectedValue(mockError);

      await rolesController.updateRole(mockReq, {});

      expect(rolesService.updateRole).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour du role", null, mockError);
    });
  });

  describe("deleteRole", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 } };
      rolesService.deleteRole.mockResolvedValue(true);

      await rolesController.deleteRole(mockReq, {});

      expect(rolesService.deleteRole).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Role supprimé avec succès");
    });

    it("should return an error with status 404 if role is not found", async () => {
      const mockReq = { params: { id: 99 } };
      rolesService.deleteRole.mockResolvedValue(null);

      await rolesController.deleteRole(mockReq, {}); 

      expect(rolesService.deleteRole).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Role non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      rolesService.deleteRole.mockRejectedValue(mockError);

      await rolesController.deleteRole(mockReq, {}); 

      expect(rolesService.deleteRole).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression du role", null, mockError);
    });
  });
});
