const pool = require("../services/database");
const rolesService = require("./roles.service");

jest.mock("../services/database"); // Mock the database

// Mock roles data
const mockRole = {
  id_role: 1,
  name: "Admin"
};

const mockRole2 = {
  id_role: 2,
  name: "User"
};

describe("Test Roles Service", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getRoles", () => {
    it("should return an array of all roles", async () => {
      const mockRoles = [mockRole, mockRole2];
      pool.execute.mockResolvedValue([mockRoles]);

      const roles = await rolesService.getRoles();
      const query = "SELECT * FROM Roles";

      expect(pool.execute).toHaveBeenCalledWith(query);
      expect(roles).toEqual(mockRoles);
    });
  });

  describe("getRoleById", () => {
    it("should return a role based on the id", async () => {
      pool.execute.mockResolvedValue([[mockRole]]);

      const role = await rolesService.getRoleById(1);
      const query = "SELECT * FROM Roles WHERE id_role = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(role).toEqual(mockRole);
    });

    it("should return null if the role is not found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const role = await rolesService.getRoleById(99);
      const query = "SELECT * FROM Roles WHERE id_role = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(role).toBeNull();
    });
  });

  describe("createRole", () => {
    it("should create a role and return the created role", async () => {
      const roleData = {
        name: "Admin"
      };
      const mockResult = { insertId: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const role = await rolesService.createRole(roleData);
      const query = "INSERT INTO Roles (name) VALUES (?)";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Admin"]);
      expect(role).toEqual(mockRole);
    });
  });

  describe("updateRole", () => {
    it("should update the specified fields of the role and return the updated role", async () => {
      const roleData = {
        name: "Admin"
      };
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const role = await rolesService.updateRole(1, roleData);
      const query = "UPDATE Roles SET name = ? WHERE id_role = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Admin", 1]);
      expect(role).toEqual(mockRole);
    });

    it("should return null if the role is not found", async () => {
      const roleData = {
        name: "Admin"
      };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const role = await rolesService.updateRole(99, roleData);
      const query = "UPDATE Roles SET name = ? WHERE id_role = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Admin", 99]);
      expect(role).toBeNull();
    });
  });

  describe("deleteRole", () => {
    it("should delete the role", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await rolesService.deleteRole(1);
      const query = "DELETE FROM Roles WHERE id_role = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the role is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await rolesService.deleteRole(99);
      const query = "DELETE FROM Roles WHERE id_role = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });
});
