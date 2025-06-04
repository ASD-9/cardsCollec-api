const pool = require("../services/database");
const raritiesService = require("./rarities.service");

jest.mock("../services/database"); // Mock the database

// Mock rarities data
const mockRarity = {
  id_rarity: 1,
  name: "Common",
  abbreviated_name: "C",
  rank: 1,
  id_collection: 1,
};

const mockRarity2 = {
  id_rarity: 2,
  name: "Rare",
  abbreviated_name: "R",
  rank: 2,
  id_collection: 1,
};

describe("Test Rarities Service", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getRarities", () => {
    it("should return an array of all rarities", async () => {
      const mockRarities = [mockRarity, mockRarity2];
      pool.execute.mockResolvedValue([mockRarities]);

      const rarities = await raritiesService.getRarities();
      const query = "SELECT * FROM Rarities";

      expect(pool.execute).toHaveBeenCalledWith(query);
      expect(rarities).toEqual(mockRarities);
    });
  });

  describe("getRaritiesByCollection", () => {
    it("should return an array of rarities for a specific collection", async () => {
      const idCollection = 1;
      const mockRarities = [mockRarity, mockRarity2];
      pool.execute.mockResolvedValue([mockRarities]);

      const rarities = await raritiesService.getRaritiesByCollection(
        idCollection
      );
      const query = "SELECT * FROM Rarities WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [idCollection]);
      expect(rarities).toEqual(mockRarities);
    });
  });

  describe("getRarityById", () => {
    it("should return a rarity based on the id", async () => {
      pool.execute.mockResolvedValue([[mockRarity]]);

      const rarity = await raritiesService.getRarityById(1);
      const query = "SELECT * FROM Rarities WHERE id_rarity = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(rarity).toEqual(mockRarity);
    });

    it("should return null if the rarity is not found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const rarity = await raritiesService.getRarityById(99);
      const query = "SELECT * FROM Rarities WHERE id_rarity = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(rarity).toBeNull();
    });
  });

  describe("createRarity", () => {
    it("should create a new rarity and return the created rarity", async () => {
      const rarityData = {
        name: "Common",
        abbreviated_name: "C",
        rank: 1,
        id_collection: 1,
      };
      const mockResult = { insertId: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const createdRarity = await raritiesService.createRarity(rarityData);
      const query =
        "INSERT INTO Rarities (name, abbreviated_name, `rank`, id_collection) VALUES (?, ?, ?, ?)";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Common", "C", 1, 1]);
      expect(createdRarity).toEqual(mockRarity);
    });
  });

  describe("updateRarity", () => {
    it("should update the specified fields of the rarity and return the updated rarity", async () => {
      const rarityData = {
        name: "Common",
        abbreviated_name: "C",
      };
      const mockResult = { affectedRows: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (update)
        .mockResolvedValueOnce([[mockRarity]]); // Mock the return value for the second query (getRarityById)

      const updatedRarity = await raritiesService.updateRarity(1, rarityData);
      const query =
        "UPDATE Rarities SET name = ?, abbreviated_name = ? WHERE id_rarity = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Common", "C", 1]);
      expect(updatedRarity).toEqual(mockRarity);
    });

    it("should return null if the rarity is not found", async () => {
      const rarityData = {
        name: "Common",
        abbreviated_name: "C",
      };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const updatedRarity = await raritiesService.updateRarity(99, rarityData);
      const query =
        "UPDATE Rarities SET name = ?, abbreviated_name = ? WHERE id_rarity = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Common", "C", 99]);
      expect(updatedRarity).toBeNull();
    });
  });

  describe("deleteRarity", () => {
    it("should delete the rarity", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await raritiesService.deleteRarity(1);
      const query = "DELETE FROM Rarities WHERE id_rarity = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the rarity is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await raritiesService.deleteRarity(99);
      const query = "DELETE FROM Rarities WHERE id_rarity = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });
});
