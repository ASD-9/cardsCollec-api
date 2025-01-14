const pool = require("../services/database");
const setsService = require("./sets.service");

jest.mock("../services/database"); // Mock the database

// Mock sets data
const mockSet = {
  id_set: 1,
  name: "Set1",
  image_path: "path/to/set1.png",
  id_collection: 1,
};

const mockSet2 = {
  id_set: 2,
  name: "Set2",
  image_path: "path/to/set2.png",
  id_collection: 1,
};

describe("Test Sets Service", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSets", () => {
    it("should return an array of all sets", async () => {
      const mockSets = [mockSet, mockSet2];
      pool.execute.mockResolvedValue([mockSets]);

      const sets = await setsService.getSets();
      const query = "SELECT * FROM Sets";

      expect(pool.execute).toHaveBeenCalledWith(query);
      expect(sets).toEqual(mockSets);
    });
  });

  describe("getSetsByCollection", () => {
    it("should return an array of sets for a specific collection", async () => {
      const idCollection = 1;
      const mockSets = [mockSet, mockSet2];
      pool.execute.mockResolvedValue([mockSets]);

      const sets = await setsService.getSetsByCollection(idCollection);
      const query = "SELECT * FROM Sets WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [idCollection]);
      expect(sets).toEqual(mockSets);
    });
  });

  describe("getSetById", () => {
    it("should return a set based on the id", async () => {
      pool.execute.mockResolvedValue([[mockSet]]);

      const set = await setsService.getSetById(1);
      const query = "SELECT * FROM Sets WHERE id_set = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(set).toEqual(mockSet);
    });

    it("should return null if the set is not found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const set = await setsService.getSetById(99);
      const query = "SELECT * FROM Sets WHERE id_set = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(set).toBeNull();
    });
  });

  describe("createSet", () => {
    it("should create a new set", async () => {
      const setData = {
        name: "Set1",
        image_path: "path/to/set1.png",
        id_collection: 1
      }
      const mockResult = { insertId: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const set = await setsService.createSet(setData);
      const query = "INSERT INTO Sets (name, image_path, id_collection) VALUES (?, ?, ?)";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Set1", "path/to/set1.png", 1]);
      expect(set).toEqual(mockSet);
    });
  }); 

  describe("updateSet", () => {
    it("should update the specified fields of the set and return the updated set", async () => {
      const setData = { name: "Set1" };
      const mockResult = { affectedRows: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (update)
        .mockResolvedValueOnce([[mockSet]]); // Mock the return value for the second query (getSetById)

      const set = await setsService.updateSet(1, setData);
      const query = "UPDATE Sets SET name = ? WHERE id_set = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Set1", 1]);
      expect(set).toEqual(mockSet);
    });

    it("should return null if the set is not found", async () => {
      const setData = { name: "Set1" };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const set = await setsService.updateSet(99, setData);
      const query = "UPDATE Sets SET name = ? WHERE id_set = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Set1", 99]);
      expect(set).toBeNull();
    });
  });

  describe("deleteSet", () => {
    it("should delete the set", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await setsService.deleteSet(1);
      const query = "DELETE FROM Sets WHERE id_set = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the set is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await setsService.deleteSet(99);
      const query = "DELETE FROM Sets WHERE id_set = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });
});
