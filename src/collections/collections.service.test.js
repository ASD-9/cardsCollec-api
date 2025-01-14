const pool = require("../services/database");
const collectionsService = require("./collections.service");

jest.mock("../services/database"); // Mock the database

// Mock collections data
const mockCollection = {
  id_collection: 1,
  name: "Collection1",
  image_path: "path/to/collection1.png"
};

const mockCollection2 = {
  id_collection: 2,
  name: "Collection2",
  image_path: "path/to/collection2.png"
};

describe("Test Collections Service", () => {
  // Clean mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCollections", () => {
    it("should return an array of all collections", async () => {
      const mockCollections = [mockCollection, mockCollection2];
      pool.execute.mockResolvedValue([mockCollections]);

      const collections = await collectionsService.getCollections();
      const query = "SELECT * FROM Collections";

      expect(pool.execute).toHaveBeenCalledWith(query);
      expect(collections).toEqual(mockCollections);
    });
  });

  describe("getCollectionById", () => {
    it("should return a collection based on the id", async () => {
      pool.execute.mockResolvedValue([[mockCollection]]);

      const collection = await collectionsService.getCollectionById(1);
      const query = "SELECT * FROM Collections WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(collection).toEqual(mockCollection);
    });

    it("should return null if the collection is not found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const collection = await collectionsService.getCollectionById(99);
      const query = "SELECT * FROM Collections WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(collection).toBeNull();
    });
  });

  describe("createCollection", () => {
    it("should create a collection and return the created collection", async () => {
      const collectionData = {
        name: "Collection1",
        image_path: "path/to/collection1.png"
      };
      const mockResult = { insertId: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const collection = await collectionsService.createCollection(collectionData);
      const query = "INSERT INTO Collections (name, image_path) VALUES (?, ?)";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Collection1", "path/to/collection1.png"]);
      expect(collection).toEqual(mockCollection);
    });
  });

  describe("updateCollection", () => {
    it("should update the specified fields of the collection and return the updated collection", async () => {
      const collectionData = {
        name: "Collection1"
      };
      const mockResult = { affectedRows: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (update)
        .mockResolvedValueOnce([[mockCollection]]); // Mock the return value for the second query (getCollectionById)

      const collection = await collectionsService.updateCollection(1, collectionData);
      const query = "UPDATE Collections SET name = ? WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Collection1", 1]);
      expect(collection).toEqual(mockCollection);
    });

    it("should return null if the collection is not found", async () => {
      const collectionData = {
        name: "Collection1"
      };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const collection = await collectionsService.updateCollection(99, collectionData);
      const query = "UPDATE Collections SET name = ? WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, ["Collection1", 99]);
      expect(collection).toBeNull();
    });
  });

  describe("deleteCollection", () => {
    it("should delete the collection", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await collectionsService.deleteCollection(1);
      const query = "DELETE FROM Collections WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the collection is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await collectionsService.deleteCollection(99);
      const query = "DELETE FROM Collections WHERE id_collection = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });
});
