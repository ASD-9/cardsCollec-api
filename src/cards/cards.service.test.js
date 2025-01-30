const pool = require("../services/database");
const cardsService = require("./cards.service");

jest.mock("../services/database"); // Mock the database

// Mock cards data
const mockCard = {
  id_card: 1,
  image_path: "path/to/card1.png",
  number: 1,
  id_rarity: 1,
  id_set: 1,
  name: "Rare",
  abbreviated_name: "R",
  rank: 1,
  id_collection: 1,
  set_name: "Set1",
  is_in_collection: true
};

const formatedMockCard = {
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
  id_rarity: 1,
  id_set: 1,
  name: "Rare",
  abbreviated_name: "R",
  rank: 1,
  id_collection: 1,
  set_name: "Set1",
  is_in_collection: false
};

const formatedMockCard2 = {
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

describe("Test Cards Service", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCards", () => {
    it("should return an array of all cards", async () => {
      const mockCards = [mockCard, mockCard2];
      pool.execute.mockResolvedValue([mockCards]);

      const cards = await cardsService.getCards(1);
      const query = `
    SELECT 
      c.*,
      s.name as set_name,
      r.*,
      CASE 
        WHEN uc.id_user IS NOT NULL THEN true
        ELSE false
      END AS is_in_collection
    FROM 
      Cards c
    LEFT JOIN 
      Users_Cards uc ON c.id_card = uc.id_card AND uc.id_user = ?
    INNER JOIN
      Sets s ON c.id_set = s.id_set
    INNER JOIN
      Rarities r ON c.id_rarity = r.id_rarity
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(cards).toEqual([formatedMockCard, formatedMockCard2]);
    });
  });

  describe("getCardsBySet", () => {
    it("should return an array of cards for a specific set", async () => {
      const idSet = 1;
      const mockCards = [mockCard, mockCard2];
      pool.execute.mockResolvedValue([mockCards]);

      const cards = await cardsService.getCardsBySet(1, idSet);
      const query = `
    SELECT 
      c.*,
      s.name as set_name,
      r.*,
      CASE 
        WHEN uc.id_user IS NOT NULL THEN true
        ELSE false
      END AS is_in_collection
    FROM 
      Cards c
    LEFT JOIN 
      Users_Cards uc ON c.id_card = uc.id_card AND uc.id_user = ?
    INNER JOIN
      Sets s ON c.id_set = s.id_set
    INNER JOIN
      Rarities r ON c.id_rarity = r.id_rarity
    WHERE c.id_set = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [1, idSet]);
      expect(cards).toEqual([formatedMockCard, formatedMockCard2]);
    });
  });

  describe("getCardById", () => {
    it("should return a card based on the id", async () => {
      pool.execute.mockResolvedValue([[mockCard]]);

      const card = await cardsService.getCardById(1, 1);
      const query = `
    SELECT 
      c.*,
      s.name as set_name,
      r.*,
      CASE 
        WHEN uc.id_user IS NOT NULL THEN true
        ELSE false
      END AS is_in_collection
    FROM 
      Cards c
    LEFT JOIN 
      Users_Cards uc ON c.id_card = uc.id_card AND uc.id_user = ?
    INNER JOIN
      Sets s ON c.id_set = s.id_set
    INNER JOIN
      Rarities r ON c.id_rarity = r.id_rarity
    WHERE c.id_card = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [1, 1]);
      expect(card).toEqual(formatedMockCard);
    });

    it("should return null if the rarity is not found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const card = await cardsService.getCardById(99, 1);
      const query = `
    SELECT 
      c.*,
      s.name as set_name,
      r.*,
      CASE 
        WHEN uc.id_user IS NOT NULL THEN true
        ELSE false
      END AS is_in_collection
    FROM 
      Cards c
    LEFT JOIN 
      Users_Cards uc ON c.id_card = uc.id_card AND uc.id_user = ?
    INNER JOIN
      Sets s ON c.id_set = s.id_set
    INNER JOIN
      Rarities r ON c.id_rarity = r.id_rarity
    WHERE c.id_card = ?
  `;

      expect(pool.execute).toHaveBeenCalledWith(query, [1, 99]);
      expect(card).toBeNull();
    });
  });

  describe("createCard", () => {
    it("should create a new card and return the created card", async () => {
      const cardData = {
        image_path: "path/to/card1.png",
        number: 1,
        id_rarity: 1,
        id_set: 1
      };
      const mockResult = { insertId: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (create)
        .mockResolvedValueOnce([[mockCard]]); // Mock the return value for the second query (getCardById)

      const card = await cardsService.createCard(cardData);
      const query = `INSERT INTO Cards (image_path, number, id_rarity, id_set) VALUES (?, ?, ?, ?)`;

      expect(pool.execute).toHaveBeenCalledWith(query, [cardData.image_path, cardData.number, cardData.id_rarity, cardData.id_set]);
      expect(card).toEqual(formatedMockCard);
    })
  });

  describe("updateCard", () => {
    it("should update the specified fields of the card and return the updated card", async () => {
      const cardData = {
        id_rarity: 1
      };
      const mockResult = { affectedRows: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (update)
        .mockResolvedValueOnce([[mockCard]]); // Mock the return value for the second query (getCardById)

      const card = await cardsService.updateCard(1, 1, cardData);
      const query = `UPDATE Cards SET id_rarity = ? WHERE id_card = ?`;

      expect(pool.execute).toHaveBeenCalledWith(query, [cardData.id_rarity, 1]);
      expect(card).toEqual(formatedMockCard);
    });

    it("should return null if the card is not found", async () => {
      const cardData = {
        id_rarity: 1
      };
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const card = await cardsService.updateCard(99, 1, cardData);
      const query = `UPDATE Cards SET id_rarity = ? WHERE id_card = ?`;

      expect(pool.execute).toHaveBeenCalledWith(query, [cardData.id_rarity, 99]);
      expect(card).toBeNull();
    });
  });

  describe("deleteCard", () => {
    it("should delete the card", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await cardsService.deleteCard(1);
      const query = "DELETE FROM Cards WHERE id_card = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(true);
    });

    it("should return null if the card is not found", async () => {
      const mockResult = { affectedRows: 0 };
      pool.execute.mockResolvedValue([mockResult]);

      const result = await cardsService.deleteCard(99);
      const query = "DELETE FROM Cards WHERE id_card = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [99]);
      expect(result).toBeNull();
    });
  });

  describe("addCardToUser", () => {
    it("should create the relation between the user and the card and return the card", async () => {
      pool.execute.mockResolvedValue([[mockCard]]); // Mock the return value for the second query (getCardById)

      const card = await cardsService.addCardToUser(1, 1);
      const query = "INSERT INTO Users_Cards (id_user, id_card) VALUES (?, ?)";

      expect(pool.execute).toHaveBeenCalledWith(query, [1, 1]);
      expect(card).toEqual(formatedMockCard);
    });
  });

  describe("removeCardFromUser", () => {
    it("should delete the relation between the user and the card and return the card", async () => {
      const mockResult = { affectedRows: 1 };
      pool.execute
        .mockResolvedValueOnce([mockResult]) // Mock the return value for the first query (delete)
        .mockResolvedValueOnce([[mockCard]]); // Mock the return value for the second query (getCardById)

      const card = await cardsService.removeCardFromUser(1, 1);
      const query = "DELETE FROM Users_Cards WHERE id_user = ? AND id_card = ?";

      expect(pool.execute).toHaveBeenCalledWith(query, [1, 1]);
      expect(card).toEqual(formatedMockCard);
    });
  });
});
