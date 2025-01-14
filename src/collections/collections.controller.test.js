const collectionsController = require("./collections.controller");
const collectionsService = require("./collections.service");
const responseHandler = require("../services/response.handler");

jest.mock("./collections.service"); // Mock the collectionsService
jest.mock("../services/response.handler"); // Mock the response handler

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

describe("Test Collections Controller", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCollections", () => {
    it("should return a list of collections with status 200", async () => {
      const mockCollections = [mockCollection, mockCollection2];
      collectionsService.getCollections.mockResolvedValue(mockCollections);

      await collectionsController.getCollections({}, {});

      expect(collectionsService.getCollections).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Collections récupérées avec succès", mockCollections);
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      collectionsService.getCollections.mockRejectedValue(mockError);

      await collectionsController.getCollections({}, {});

      expect(collectionsService.getCollections).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des collections", null, mockError);
    });
  });

  describe("getCollectionById", () => {
    it("should return a collection with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      collectionsService.getCollectionById.mockResolvedValue(mockCollection);

      await collectionsController.getCollectionById(mockReq, {});

      expect(collectionsService.getCollectionById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Collection récupérée avec succès", mockCollection);
    });

    it("should return an error with status 404 if collection not found", async () => {
      const mockReq = { params: { id: 99 } };
      collectionsService.getCollectionById.mockResolvedValue(null);

      await collectionsController.getCollectionById(mockReq, {});

      expect(collectionsService.getCollectionById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Collection non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      collectionsService.getCollectionById.mockRejectedValue(mockError);

      await collectionsController.getCollectionById(mockReq, {});

      expect(collectionsService.getCollectionById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération de la collection", null, mockError);
    });
  });

  describe("createCollection", () => {
    it("should return the new collection with status 201", async () => {
      const mockReq = { body: { name: "Collection1", image_path: "path/to/collection1.png" } };
      collectionsService.createCollection.mockResolvedValue(mockCollection);

      await collectionsController.createCollection(mockReq, {});

      expect(collectionsService.createCollection).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 201, "Collection créée avec succès", mockCollection);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: { name: "Collection1", image_path: "path/to/collection1.png" } };
      const mockError = new Error("Database error");
      collectionsService.createCollection.mockRejectedValue(mockError);

      await collectionsController.createCollection(mockReq, {});

      expect(collectionsService.createCollection).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la création de la collection", null, mockError);
    });
  });

  describe("updateCollection", () => {
    it("should return the updated collection with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Collection1" } };
      collectionsService.updateCollection.mockResolvedValue(mockCollection);

      await collectionsController.updateCollection(mockReq, {});

      expect(collectionsService.updateCollection).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Collection mise à jour avec succès", mockCollection);
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 }, body: {} };

      await collectionsController.updateCollection(mockReq, {});

      expect(collectionsService.updateCollection).not.toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 400, "Données manquantes");
    });

    it("should return an error with status 404 if collection not found", async () => {
      const mockReq = { params: { id: 99 }, body: { name: "Collection1" } };
      collectionsService.updateCollection.mockResolvedValue(null);

      await collectionsController.updateCollection(mockReq, {});

      expect(collectionsService.updateCollection).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Collection non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Collection1" } };
      const mockError = new Error("Database error");
      collectionsService.updateCollection.mockRejectedValue(mockError);

      await collectionsController.updateCollection(mockReq, {});

      expect(collectionsService.updateCollection).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour de la collection", null, mockError);
    });
  });

  describe("deleteCollection", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 } };
      collectionsService.deleteCollection.mockResolvedValue(true);

      await collectionsController.deleteCollection(mockReq, {});

      expect(collectionsService.deleteCollection).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Collection supprimée avec succès");
    });

    it("should return an error with status 404 if collection not found", async () => {
      const mockReq = { params: { id: 99 } };
      collectionsService.deleteCollection.mockResolvedValue(null);

      await collectionsController.deleteCollection(mockReq, {});

      expect(collectionsService.deleteCollection).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Collection non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      collectionsService.deleteCollection.mockRejectedValue(mockError);

      await collectionsController.deleteCollection(mockReq, {});

      expect(collectionsService.deleteCollection).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression de la collection", null, mockError);
    });
  });
});
