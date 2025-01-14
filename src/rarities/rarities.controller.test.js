const rarityController = require("./rarities.controller");
const raritiesService = require("./rarities.service");
const responseHandler = require("../services/response.handler");

jest.mock("./rarities.service"); // Mock the raritiesService
jest.mock("../services/response.handler"); // Mock the response handler

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
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getRarities", () => {
    it("should return a list of rarities with status 200", async () => {
      const mockRarities = [mockRarity, mockRarity2];
      raritiesService.getRarities.mockResolvedValue(mockRarities);

      await rarityController.getRarities({}, {});

      expect(raritiesService.getRarities).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Raretés récupérées avec succès", mockRarities);
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      raritiesService.getRarities.mockRejectedValue(mockError);

      await rarityController.getRarities({}, {});

      expect(raritiesService.getRarities).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des raretés", null, mockError);
    });
  });

  describe("getRaritiesByCollection", () => {
    it("should return a list of rarities for a specific collection with status 200", async () => {
      const mockReq = { params: { idCollection: 1 } };
      const mockRarities = [mockRarity, mockRarity2];
      raritiesService.getRaritiesByCollection.mockResolvedValue(mockRarities);

      await rarityController.getRaritiesByCollection(mockReq, {});

      expect(raritiesService.getRaritiesByCollection).toHaveBeenCalledWith(mockReq.params.idCollection);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Raretés récupérées avec succès", mockRarities);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { idCollection: 1 } };
      const mockError = new Error("Database error");
      raritiesService.getRaritiesByCollection.mockRejectedValue(mockError);

      await rarityController.getRaritiesByCollection(mockReq, {});

      expect(raritiesService.getRaritiesByCollection).toHaveBeenCalledWith(mockReq.params.idCollection);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des raretés", null, mockError);
    });
  });

  describe("getRarityById", () => {
    it("should return a rarity with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      raritiesService.getRarityById.mockResolvedValue(mockRarity);

      await rarityController.getRarityById(mockReq, {});

      expect(raritiesService.getRarityById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Rareté récupérée avec succès", mockRarity);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      raritiesService.getRarityById.mockRejectedValue(mockError);

      await rarityController.getRarityById(mockReq, {});

      expect(raritiesService.getRarityById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération de la rareté", null, mockError);
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

      await rarityController.createRarity(mockReq, {});

      expect(raritiesService.createRarity).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 201, "Rareté créée avec succès", mockRarity);
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

      await rarityController.createRarity(mockReq, {});

      expect(raritiesService.createRarity).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la création de la rareté", null, mockError);
    });
  });

  describe("updateRarity", () => {
    it("should return the updated rarity with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: {
        name: "Common",
        abbreviated_name: "C"
      }};
      raritiesService.updateRarity.mockResolvedValue(mockRarity);

      await rarityController.updateRarity(mockReq, {});

      expect(raritiesService.updateRarity).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Rareté mise à jour avec succès", mockRarity);
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await rarityController.updateRarity(mockReq, {});

      expect(raritiesService.updateRarity).not.toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 400, "Données manquantes");
    });

    it("should return an error with status 404 if rarity not found", async () => {
      const mockReq = { params: { id: 99 }, body: {
        name: "Common",
        abbreviated_name: "C"
      }};
      raritiesService.updateRarity.mockResolvedValue(null);

      await rarityController.updateRarity(mockReq, {});

      expect(raritiesService.updateRarity).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Rareté non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: {
        name: "Common",
        abbreviated_name: "C"
      }};
      const mockError = new Error("Database error");
      raritiesService.updateRarity.mockRejectedValue(mockError);

      await rarityController.updateRarity(mockReq, {});

      expect(raritiesService.updateRarity).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour de la rareté", null, mockError);
    });
  });

  describe("deleteRarity", () => {
    it("should status 200", async () => {
      const mockReq = { params: { id: 1 }};
      raritiesService.deleteRarity.mockResolvedValue(mockRarity);

      await rarityController.deleteRarity(mockReq, {});  

      expect(raritiesService.deleteRarity).toHaveBeenCalledWith(mockReq.params.id); 
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Rareté supprimée avec succès");
    });

    it("should return an error with status 404 if rarity not found", async () => {
      const mockReq = { params: { id: 99 }};
      raritiesService.deleteRarity.mockResolvedValue(null);

      await rarityController.deleteRarity(mockReq, {});

      expect(raritiesService.deleteRarity).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Rareté non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }};
      const mockError = new Error("Database error");
      raritiesService.deleteRarity.mockRejectedValue(mockError);

      await rarityController.deleteRarity(mockReq, {});

      expect(raritiesService.deleteRarity).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression de la rareté", null, mockError);
    });
  });
});
