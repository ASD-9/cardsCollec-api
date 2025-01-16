const cardsController = require("./cards.controller");
const cardsService = require("./cards.service");
const responseHandler = require("../services/response.handler");

jest.mock("./cards.service"); // Mock the cardsService
jest.mock("../services/response.handler"); // Mock the response handler

// Mock cards data
const mockCard = {
  id_card: 1,
  image_path: "path/to/card1.png",
  number: 1,
  rarity: {
    id_rarity: 1,
    name: "Rare",
    abbreviated_name: "R",
    rank: 1
  },
  set: {
    id_set: 1,
    name: "Set1"
  },
  is_in_collection: true
};

const mockCard2 = {
  id_card: 2,
  image_path: "path/to/card2.png",
  number: 2,
  rarity: {
    id_rarity: 1,
    name: "Rare",
    abbreviated_name: "R",
    rank: 1
  },
  set: {
    id_set: 1,
    name: "Set1"
  },
  is_in_collection: false
};

describe("Test Cards Controller", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCards", () => {
    it("should return a list of cards with status 200", async () => {
      const mockReq = { user: { id_user: 1 } };
      const mockCards = [mockCard, mockCard2];
      cardsService.getCards.mockResolvedValue(mockCards);

      await cardsController.getCards(mockReq, {});

      expect(cardsService.getCards).toHaveBeenCalledWith(mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Cartes récupérées avec succès", mockCards);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { user: { id_user: 1 } };
      const mockError = new Error("Database error");
      cardsService.getCards.mockRejectedValue(mockError);

      await cardsController.getCards(mockReq, {});

      expect(cardsService.getCards).toHaveBeenCalledWith(mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des cartes", null, mockError);
    });
  });

  describe("getCardsBySet", () => {
    it("should return a list of cards for a specific set with status 200", async () => {
      const mockReq = { user: { id_user: 1 }, params: { idSet: 1 } };
      const mockCards = [mockCard, mockCard2];
      cardsService.getCardsBySet.mockResolvedValue(mockCards);

      await cardsController.getCardsBySet(mockReq, {});

      expect(cardsService.getCardsBySet).toHaveBeenCalledWith(mockReq.user.id_user, mockReq.params.idSet);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Cartes récupérées avec succès", mockCards);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { user: { id_user: 1 }, params: { idSet: 1 } };
      const mockError = new Error("Database error");
      cardsService.getCardsBySet.mockRejectedValue(mockError);

      await cardsController.getCardsBySet(mockReq, {});

      expect(cardsService.getCardsBySet).toHaveBeenCalledWith(mockReq.user.id_user, mockReq.params.idSet);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des cartes", null, mockError);
    });
  });

  describe("getCardById", () => {
    it("should return a card with status 200", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 } };
      cardsService.getCardById.mockResolvedValue(mockCard);

      await cardsController.getCardById(mockReq, {});

      expect(cardsService.getCardById).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Carte récupérée avec succès", mockCard);
    });

    it("should return an error with status 404 if card not found", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 99 } };
      cardsService.getCardById.mockResolvedValue(null);

      await cardsController.getCardById(mockReq, {});

      expect(cardsService.getCardById).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Carte non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 } };
      const mockError = new Error("Database error");
      cardsService.getCardById.mockRejectedValue(mockError);

      await cardsController.getCardById(mockReq, {});

      expect(cardsService.getCardById).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération de la carte", null, mockError);
    });
  });

  describe("createCard", () => {
    it("should return the new card with status 201", async () => {
      const mockReq = { body: {
        image_path: "path/to/card1.png",
        number: 1,
        id_rarity: 1,
        id_set: 1
      } };
      cardsService.createCard.mockResolvedValue(mockCard);

      await cardsController.createCard(mockReq, {});

      expect(cardsService.createCard).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 201, "Carte crée avec succès", mockCard);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: {
        image_path: "path/to/card1.png",
        number: 1,
        id_rarity: 1,
        id_set: 1
      } };
      const mockError = new Error("Database error");
      cardsService.createCard.mockRejectedValue(mockError);

      await cardsController.createCard(mockReq, {});

      expect(cardsService.createCard).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la création de la carte", null, mockError);
    });
  });

  describe("updateCard", () => {
    it("should return the updated card with status 200", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 }, body: { id_rarity: 1 } };
      cardsService.updateCard.mockResolvedValue(mockCard);

      await cardsController.updateCard(mockReq, {});

      expect(cardsService.updateCard).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Carte mise à jour avec succès", mockCard);
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 }, body: {} };

      await cardsController.updateCard(mockReq, {});

      expect(cardsService.updateCard).not.toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 400, "Données manquantes");
    });

    it("should return an error with status 404 if card not found", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 99 }, body: { id_rarity: 1 } };
      cardsService.updateCard.mockResolvedValue(null);

      await cardsController.updateCard(mockReq, {});

      expect(cardsService.updateCard).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Carte non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 }, body: { id_rarity: 1 } };
      const mockError = new Error("Database error");
      cardsService.updateCard.mockRejectedValue(mockError);

      await cardsController.updateCard(mockReq, {});

      expect(cardsService.updateCard).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour de la carte", null, mockError);
    });
  });

  describe("deleteCard", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 } };
      cardsService.deleteCard.mockResolvedValue(true);

      await cardsController.deleteCard(mockReq, {});

      expect(cardsService.deleteCard).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Carte supprimée avec succès");
    });

    it("should return an error with status 404 if card not found", async () => {
      const mockReq = { params: { id: 99 } };
      cardsService.deleteCard.mockResolvedValue(null);

      await cardsController.deleteCard(mockReq, {});

      expect(cardsService.deleteCard).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Carte non trouvée");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      cardsService.deleteCard.mockRejectedValue(mockError);

      await cardsController.deleteCard(mockReq, {});

      expect(cardsService.deleteCard).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression de la carte", null, mockError);
    });
  });

  describe("addCardToUser", () => {
    it("should return the card with status 200", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 } };
      cardsService.addCardToUser.mockResolvedValue(mockCard);

      await cardsController.addCardToUser(mockReq, {});

      expect(cardsService.addCardToUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Carte ajoutée à l'utilisateur avec succès", mockCard);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 } };
      const mockError = new Error("Database error");
      cardsService.addCardToUser.mockRejectedValue(mockError);

      await cardsController.addCardToUser(mockReq, {});

      expect(cardsService.addCardToUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de l'ajout de la carte à l'utilisateur", null, mockError);
    });
  });

  describe("removeCardFromUser", () => {
    it("should return the card with status 200", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 } };
      cardsService.removeCardFromUser.mockResolvedValue(mockCard);

      await cardsController.removeCardFromUser(mockReq, {});

      expect(cardsService.removeCardFromUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Carte supprimée de l'utilisateur avec succès", mockCard);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { user: { id_user: 1 }, params: { id: 1 } };
      const mockError = new Error("Database error");
      cardsService.removeCardFromUser.mockRejectedValue(mockError);

      await cardsController.removeCardFromUser(mockReq, {});

      expect(cardsService.removeCardFromUser).toHaveBeenCalledWith(mockReq.params.id, mockReq.user.id_user);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression de la carte de l'utilisateur", null, mockError);
    });
  });
});
