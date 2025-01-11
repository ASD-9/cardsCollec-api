const rarityController = require("./rarities.controller");
const raritiesService = require("./rarities.service");

jest.mock("./rarities.service"); // Mock the raritiesService

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

describe("Test Rarities Controller", () => {
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

  describe("getRarities", () => {
    it("should return a list of rarities with status 200", async () => {
      const mockRarities = [mockRarity, mockRarity2];
      raritiesService.getRarities.mockResolvedValue(mockRarities);

      await rarityController.getRarities({}, mockRes);

      expect(raritiesService.getRarities).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Raretés récupérées avec succès",
        data: mockRarities,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      raritiesService.getRarities.mockRejectedValue(mockError);

      await rarityController.getRarities({}, mockRes);

      expect(raritiesService.getRarities).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération des raretés",
        data: null,
        error: mockError
      });
    });
  });

  describe("getRaritiesByCollection", () => {
    it("should return a list of rarities for a specific collection with status 200", async () => {
      const mockReq = { params: { idCollection: 1 } };
      const mockRarities = [mockRarity, mockRarity2];
      raritiesService.getRaritiesByCollection.mockResolvedValue(mockRarities);

      await rarityController.getRaritiesByCollection(mockReq, mockRes);

      expect(raritiesService.getRaritiesByCollection).toHaveBeenCalledWith(mockReq.params.idCollection);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Raretés récupérées avec succès",
        data: mockRarities,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { idCollection: 1 } };
      const mockError = new Error("Database error");
      raritiesService.getRaritiesByCollection.mockRejectedValue(mockError);

      await rarityController.getRaritiesByCollection(mockReq, mockRes);

      expect(raritiesService.getRaritiesByCollection).toHaveBeenCalledWith(mockReq.params.idCollection);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération des raretés",
        data: null,
        error: mockError
      });
    });
  });

  describe("getRarityById", () => {
    it("should return a rarity with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      raritiesService.getRarityById.mockResolvedValue(mockRarity);

      await rarityController.getRarityById(mockReq, mockRes);

      expect(raritiesService.getRarityById).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Rareté récupérée avec succès",
        data: mockRarity,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      raritiesService.getRarityById.mockRejectedValue(mockError);

      await rarityController.getRarityById(mockReq, mockRes);

      expect(raritiesService.getRarityById).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la récupération de la rareté",
        data: null,
        error: mockError
      });
    });
  });

  describe("createRarity", () => {
    it("should return the new rarity with status 201", async () => {
      const mockReq = { body: {
        name: "Common",
        abbreviated_name: "C",
        rank: 1,
        id_collection: 1
      }};
      raritiesService.createRarity.mockResolvedValue(mockRarity);

      await rarityController.createRarity(mockReq, mockRes);

      expect(raritiesService.createRarity).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Rareté créée avec succès",
        data: mockRarity,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: {
        name: "Common",
        abbreviated_name: "C",
        rank: 1,
        id_collection: 1
      }};
      const mockError = new Error("Database error");
      raritiesService.createRarity.mockRejectedValue(mockError);

      await rarityController.createRarity(mockReq, mockRes);

      expect(raritiesService.createRarity).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la création de la rareté",
        data: null,
        error: mockError
      });
    });
  });

  describe("updateRarity", () => {
    it("should return the updated rarity with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: {
        name: "Common",
        abbreviated_name: "C"
      }};
      raritiesService.updateRarity.mockResolvedValue(mockRarity);

      await rarityController.updateRarity(mockReq, mockRes);

      expect(raritiesService.updateRarity).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Rareté mise à jour avec succès",
        data: mockRarity,
        error: null
      });
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await rarityController.updateRarity(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Données manquantes",
        data: null,
        error: null
      });
    });

    it("should return an error with status 404 if rarity not found", async () => {
      const mockReq = { params: { id: 99 }, body: {
        name: "Common",
        abbreviated_name: "C"
      }};
      raritiesService.updateRarity.mockResolvedValue(null);

      await rarityController.updateRarity(mockReq, mockRes);

      expect(raritiesService.updateRarity).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Rareté non trouvée",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: {
        name: "Common",
        abbreviated_name: "C"
      }};
      const mockError = new Error("Database error");
      raritiesService.updateRarity.mockRejectedValue(mockError);

      await rarityController.updateRarity(mockReq, mockRes);

      expect(raritiesService.updateRarity).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la mise à jour de la rareté",
        data: null,
        error: mockError
      });
    });
  });

  describe("deleteRarity", () => {
    it("should return the deleted rarity with status 200", async () => {
      const mockReq = { params: { id: 1 }};
      raritiesService.deleteRarity.mockResolvedValue(mockRarity);

      await rarityController.deleteRarity(mockReq, mockRes);  

      expect(raritiesService.deleteRarity).toHaveBeenCalledWith(mockReq.params.id); 
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Rareté supprimée avec succès",
        data: null,
        error: null
      });
    });

    it("should return an error with status 404 if rarity not found", async () => {
      const mockReq = { params: { id: 99 }};
      raritiesService.deleteRarity.mockResolvedValue(null);

      await rarityController.deleteRarity(mockReq, mockRes);

      expect(raritiesService.deleteRarity).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Rareté non trouvée",
        data: null,
        error: null
      });
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }};
      const mockError = new Error("Database error");
      raritiesService.deleteRarity.mockRejectedValue(mockError);

      await rarityController.deleteRarity(mockReq, mockRes);

      expect(raritiesService.deleteRarity).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de la suppression de la rareté",
        data: null,
        error: mockError
      });
    });
  });
});
