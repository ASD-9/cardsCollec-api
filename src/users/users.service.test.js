const pool = require("../services/database");
const usersService = require("./users.service");
const { hashPassword } = require("../services/hashing");

jest.mock("../services/database"); // Mock the database
jest.mock("../services/hashing"); // Mock the hashing service

describe("Test Users Service", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return an array of all users", async () => {
      const mockUsers = [
        {
          id_user: 1,
          username: "John Doe",
          password: "password",
          id_role: 1,
          role_name: "Admin",
          id_avatar: 1,
          avatar_name: "Avatar1"
        },
        {
          id_user: 2,
          username: "Jane Doe",
          password: "password",
          id_role: 1,
          role_name: "Admin",
          id_avatar: 1,
          avatar_name: "Avatar1"
        },
      ];
      pool.execute.mockResolvedValue([mockUsers]);
      
      const users = await usersService.getUsers();
      const query = `
    SELECT 
      u.*, r.id_role, r.name as role_name, a.id_avatar, a.name as avatar_name
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    INNER JOIN Avatars a ON u.id_avatar = a.id_avatar
  `;

      expect(pool.execute).toHaveBeenCalledWith(query);
      expect(users).toEqual([
        {
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
        },
        {
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
        }
      ]);
    });
  });

  describe("getUserById", () => {
    it("shoud return an user based on the id", async () => {
      const mockUser = {
        id_user: 1,
        username: "John Doe",
        password: "password",
        id_role: 1,
        role_name: "Admin",
        id_avatar: 1,
        avatar_name: "Avatar1"
      };
      pool.execute.mockResolvedValue([[mockUser]]);
      
      const user = await usersService.getUserById(1);
      const query = `
    SELECT
      u.*, r.id_role, r.name as role_name, a.id_avatar, a.name as avatar_name
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    INNER JOIN Avatars a ON u.id_avatar = a.id_avatar
    WHERE u.id_user = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(user).toEqual({
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
      });
    });

    it("should return null if the user is not found", async () => {
      pool.execute.mockResolvedValue([[]]);
      
      const user = await usersService.getUserById(99);
      const query = `
    SELECT
      u.*, r.id_role, r.name as role_name, a.id_avatar, a.name as avatar_name
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    INNER JOIN Avatars a ON u.id_avatar = a.id_avatar
    WHERE u.id_user = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(user).toBeNull();
    });
  });

  describe("getUserByUsername", () => {
    it("shoud return an user based on the username", async () => {
      const mockUser = {
        id_user: 1,
        password: "password",
      };
      pool.execute.mockResolvedValue([[mockUser]]);
      
      const user = await usersService.getUserByUsername("John Doe");
      const query = "SELECT id_user, password FROM Users WHERE username = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["John Doe"]);
      expect(user).toEqual(mockUser);
    });

    it("should return null if the user is not found", async () => {
      pool.execute.mockResolvedValue([[]]);
      
      const user = await usersService.getUserByUsername("John Doe");
      const query = "SELECT id_user, password FROM Users WHERE username = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["John Doe"]);
      expect(user).toBeNull();
    });
  });

  describe("getUserRole", () => {
    it("should return the role of the user", async () => {
      const mockRole = {
        id_role: 1,
        name: "Admin"
      };
      pool.execute.mockResolvedValue([[mockRole]]);
      
      const role = await usersService.getUserRole(1);
      const query = `
    SELECT
      r.*
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    WHERE u.id_user = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(role).toEqual({
        "id_role": 1,
        "name": "Admin"
      });
    });

    it("should return null if the user is not found", async () => {
      pool.execute.mockResolvedValue([[]]);
      
      const role = await usersService.getUserRole(99);
      const query = `
    SELECT
      r.*
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    WHERE u.id_user = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(role).toBeNull();
    });
  });

  describe("getUserRefreshToken", () => {
    it("should return the refreshToken of the user", async () => {
      const mockToken = {
        refresh_token: "refresh_token"
      };
      pool.execute.mockResolvedValue([[mockToken]]);
      
      const refreshToken = await usersService.getUserRefreshToken(1);
      const query = "SELECT refresh_token FROM Users WHERE id_user = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(refreshToken).toEqual("refresh_token");
    });

    it("should return null if the user is not found", async () => {
      pool.execute.mockResolvedValue([[]]);
      
      const refreshToken = await usersService.getUserRefreshToken(99);
      const query = "SELECT refresh_token FROM Users WHERE id_user = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(refreshToken).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create a user and return the created user with hashed password", async () => {
      const userData = {
        username: "John Doe",
        password: "password",
        id_role: 1,
        id_avatar: 1,
      };
      const mockResult = { insertId: 9 };
      const mockUser = {
        id_user: 9,
        username: "John Doe",
        password: "hashedPassword",
        id_role: 1,
        role_name: "Admin",
        id_avatar: 1,
        avatar_name: "Avatar1"
      };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (create)
        .mockResolvedValueOnce([[mockUser]]); // Mock the return value for the second query (getUserById)

      hashPassword.mockResolvedValue("hashedPassword");

      const user = await usersService.createUser(userData);
      const query = `INSERT INTO Users (username, password, id_role, id_avatar) VALUES (?, ?, ?, ?)`;

      expect(pool.execute).toHaveBeenCalledWith(query, ["John Doe", "hashedPassword", 1, 1]);
      expect(hashPassword).toHaveBeenCalledWith("password");
      expect(user).toEqual({
        "id_user": 9,
        "username": "John Doe",
        "password": "hashedPassword",
        "role": {
          "id_role": 1,
          "name": "Admin"
        },
        "avatar": {
          "id_avatar": 1,
          "name": "Avatar1"
        }
      });
    });
  });

  describe("updateUser", () => {
    it("should update the specified fields of the user and return the updated user", async () => {
      const userData = {
        username: "Updated Username",
        id_role: 2
      };
      const mockResult = { affectedRows: 1 };
      const mockUser = {
        id_user: 1,
        username: "Updated Username",
        password: "password",
        id_role: 2,
        role_name: "User",
        id_avatar: 1,
        avatar_name: "Avatar1"
      };

      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (update)
        .mockResolvedValueOnce([[mockUser]]); // Mock the return value for the second query (getUserById)

      const user = await usersService.updateUser(1, userData);
      const query = `UPDATE Users SET username = ?, id_role = ? WHERE id_user = ?`;

      expect(pool.execute).toHaveBeenCalledWith(query, ["Updated Username", 2, 1]);
      expect(user).toEqual({
        "id_user": 1,
        "username": "Updated Username",
        "password": "password",
        "role": {
          "id_role": 2,
          "name": "User"
        },
        "avatar": {
          "id_avatar": 1,
          "name": "Avatar1"
        }
      });
    });

    it("should return null if the user is not found", async () => {
      const userData = {
        username: "Updated Username"
      };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);
      
      const user = await usersService.updateUser(99, userData);
      const query = `UPDATE Users SET username = ? WHERE id_user = ?`;

      expect(pool.execute).toHaveBeenCalledWith(query, ["Updated Username", 99]);
      expect(user).toBeNull();
    });
  });

  describe("deleteUser", () => {
    it("should delete the user", async () => {
      const mockResult = { affectedRows: 1 };

      pool.execute.mockResolvedValue([mockResult]);

      const result = await usersService.deleteUser(1);
      const query = `DELETE FROM Users WHERE id_user = ?`;

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the user is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await usersService.deleteUser(99);
      const query = `DELETE FROM Users WHERE id_user = ?`;

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });
});
