const pool = require("../services/database");
const avatarsService = require("./avatars.service");

jest.mock("../services/database"); // Mock the database

// Mock avatars data
const mockAvatar = {
  id_avatar: 1,
  name: "Avatar1",
  image_path: "path/to/avatar1.png"
};

const mockAvatar2 = {
  id_avatar: 2,
  name: "Avatar2",
  image_path: "path/to/avatar2.png"
};

describe("Test Avatars Service", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvatars", () => {
    it("should return an array of all roles", async () => {
      const mockAvatars = [mockAvatar, mockAvatar2];
      pool.execute.mockResolvedValue([mockAvatars]);

      const avatars = await avatarsService.getAvatars();
      const query = "SELECT * FROM Avatars";

      expect(pool.execute).toHaveBeenCalledWith(query);
      expect(avatars).toEqual(mockAvatars);
    });
  });

  describe("getAvatarById", () => {
    it("should return an avatar based on the id", async () => {
      pool.execute.mockResolvedValue([[mockAvatar]]);

      const avatar = await avatarsService.getAvatarById(1);
      const query = "SELECT * FROM Avatars WHERE id_avatar = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(avatar).toEqual(mockAvatar);
    });

    it("should return null if the avatar is not found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const avatar = await avatarsService.getAvatarById(99);
      const query = "SELECT * FROM Avatars WHERE id_avatar = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(avatar).toBeNull();
    });
  });

  describe("createAvatar", () => {
    it("should create an avatar and return the created avatar", async () => {
      const avatarData = {
        name: "Avatar1",
        image_path: "path/to/avatar1.png"
      };
      const mockResult = { insertId: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const avatar = await avatarsService.createAvatar(avatarData);
      const query = "INSERT INTO Avatars (name, image_path) VALUES (?, ?)";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Avatar1", "path/to/avatar1.png"]);
      expect(avatar).toEqual(mockAvatar);
    });
  });

  describe("updateAvatar", () => {
    it("should update the specified fields of the avatar and return the updated avatar", async () => {
      const avatarData = {
        name: "Avatar1"
      };
      const mockResult = { affectedRows: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (update)
        .mockResolvedValueOnce([[mockAvatar]]); // Mock the return value for the second query (getAvatarById)

      const avatar = await avatarsService.updateAvatar(1, avatarData);
      const query = "UPDATE Avatars SET name = ? WHERE id_avatar = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Avatar1", 1]);
      expect(avatar).toEqual(mockAvatar);
    });

    it("should return null if the avatar is not found", async () => {
      const avatarData = {
        name: "Avatar1"
      };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const avatar = await avatarsService.updateAvatar(99, avatarData);
      const query = "UPDATE Avatars SET name = ? WHERE id_avatar = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Avatar1", 99]);
      expect(avatar).toBeNull();
    });
  });

  describe("deleteAvatar", () => {
    it("should delete the avatar", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await avatarsService.deleteAvatar(1);
      const query = "DELETE FROM Avatars WHERE id_avatar = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the avatar is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]); 

      const result = await avatarsService.deleteAvatar(99);
      const query = "DELETE FROM Avatars WHERE id_avatar = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });
});
