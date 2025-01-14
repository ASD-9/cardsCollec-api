const setsController = require("./sets.controller");
const setsService = require("./sets.service");
const responseHandler = require("../services/response.handler");

jest.mock("./sets.service"); // Mock the setsService
jest.mock("../services/response.handler"); // Mock the response handler

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

describe("Test Sets Controller", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSets", () => {
    it("should return an array of all sets with status 200", async () => {
      const mockSets = [mockSet, mockSet2];
      setsService.getSets.mockResolvedValue(mockSets);

      await setsController.getSets({}, {});

      expect(setsService.getSets).toHaveBeenCalledWith();
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Sets récupérés avec succès", mockSets);
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      setsService.getSets.mockRejectedValue(mockError);

      await setsController.getSets({}, {});

      expect(setsService.getSets).toHaveBeenCalledWith();
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des sets", null, mockError);
    });
  });

  describe("getSetsByCollection", () => {
    it("should return an array of sets for a specific collection with status 200", async () => {
      const mockReq = { params: { idCollection: 1 } };
      const mockSets = [mockSet, mockSet2];
      setsService.getSetsByCollection.mockResolvedValue(mockSets);

      await setsController.getSetsByCollection(mockReq, {});

      expect(setsService.getSetsByCollection).toHaveBeenCalledWith(mockReq.params.idCollection);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Sets récupérés avec succès", mockSets);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { idCollection: 1 } };
      const mockError = new Error("Database error");
      setsService.getSetsByCollection.mockRejectedValue(mockError);

      await setsController.getSetsByCollection(mockReq, {});

      expect(setsService.getSetsByCollection).toHaveBeenCalledWith(mockReq.params.idCollection);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des sets", null, mockError);
    });
  });

  describe("getSetById", () => {
    it("should return a set with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      setsService.getSetById.mockResolvedValue(mockSet);

      await setsController.getSetById(mockReq, {});

      expect(setsService.getSetById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Set récupéré avec succès", mockSet);
    });

    it("should return an error with status 404 if set not found", async () => {
      const mockReq = { params: { id: 99 } };
      setsService.getSetById.mockResolvedValue(null);

      await setsController.getSetById(mockReq, {});

      expect(setsService.getSetById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Set non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      setsService.getSetById.mockRejectedValue(mockError);

      await setsController.getSetById(mockReq, {});

      expect(setsService.getSetById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération du set", null, mockError);
    });
  });

  describe("createSet", () => {
    it("should return a set with status 201", async () => {
      const mockReq = { body: {
        name: "Set1",
        image_path: "path/to/set1.png",
        id_collection: 1
      } };
      setsService.createSet.mockResolvedValue(mockSet);

      await setsController.createSet(mockReq, {});

      expect(setsService.createSet).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 201, "Set créé avec succès", mockSet);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: {
        name: "Set1",
        image_path: "path/to/set1.png",
        id_collection: 1
      } };
      const mockError = new Error("Database error");
      setsService.createSet.mockRejectedValue(mockError);

      await setsController.createSet(mockReq, {});

      expect(setsService.createSet).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la création du set", null, mockError);
    });
  });

  describe("updateSet", () => {
    it("should return the updated set with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Set1" } };
      setsService.updateSet.mockResolvedValue(mockSet);

      await setsController.updateSet(mockReq, {});

      expect(setsService.updateSet).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Set mis à jour avec succès", mockSet);
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await setsController.updateSet(mockReq, {});

      expect(setsService.updateSet).not.toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 400, "Données manquantes");
    });

    it("should return an error with status 404 if set not found", async () => {
      const mockReq = { params: { id: 99 }, body: { name: "Set1" } };
      setsService.updateSet.mockResolvedValue(null);

      await setsController.updateSet(mockReq, {});

      expect(setsService.updateSet).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Set non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Set1" } };
      const mockError = new Error("Database error");
      setsService.updateSet.mockRejectedValue(mockError);

      await setsController.updateSet(mockReq, {});

      expect(setsService.updateSet).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour du set", null, mockError);
    });
  });

  describe("deleteSet", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 }};
      setsService.deleteSet.mockResolvedValue(true);

      await setsController.deleteSet(mockReq, {});

      expect(setsService.deleteSet).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Set supprimé avec succès");
    });

    it("should return an error with status 404 if set not found", async () => {
      const mockReq = { params: { id: 99 }};
      setsService.deleteSet.mockResolvedValue(null);

      await setsController.deleteSet(mockReq, {});

      expect(setsService.deleteSet).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Set non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }};
      const mockError = new Error("Database error");
      setsService.deleteSet.mockRejectedValue(mockError);

      await setsController.deleteSet(mockReq, {});

      expect(setsService.deleteSet).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression du set", null, mockError);
    });
  });
});
