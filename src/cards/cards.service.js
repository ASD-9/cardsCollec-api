const pool = require("../services/database");

// Function to format card data for consistency
const formatCardData = (row) => {
  return {
    id_card: row.id_card,
    image_path: row.image_path,
    number: row.number,
    rarity: {
      id_rarity: row.id_rarity,
      name: row.name,
      abbreviated_name: row.abbreviated_name,
      rank: row.rank
    },
    set: {
      id_set: row.id_set,
      name: row.set_name
    },
    is_in_collection: row.is_in_collection
  };
}

const getCards = async (idUser) => {
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
  const [rows] = await pool.execute(query, [idUser]);
  return rows.map(row => formatCardData(row));
}

const getCardsBySet = async (idUser, idSet) => {
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
  const [rows] = await pool.execute(query, [idUser, idSet]);
  return rows.map(row => formatCardData(row));
}

const getCardById = async (id, idUser) => {
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
  const [rows] = await pool.execute(query, [idUser, id]);
  return rows.length > 0 ? formatCardData(rows[0]) : null;
}

const createCard = async (cardData) => {
  const query = "INSERT INTO Cards (image_path, number, id_rarity, id_set) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [cardData.image_path, cardData.number, cardData.id_rarity, cardData.id_set]);
  return await getCardById(result.insertId, -1);
}

const updateCard = async (id, idUser, cardData) => {
  // Construct the update query
  const updates = Object.keys(cardData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(cardData), id];
  const query = `UPDATE Cards SET ${updates} WHERE id_card = ?`;

  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0 ? await getCardById(id, idUser) : null; // Check if the card was found
}

const deleteCard = async (id) => {
  const query = "DELETE FROM Cards WHERE id_card = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0 ? true : null; // Check if the card was found
}

const addCardToUser = async (id, idUser) => {
  const query = "INSERT INTO Users_Cards (id_user, id_card) VALUES (?, ?)";
  await pool.execute(query, [idUser, id]);
  return await getCardById(id, idUser);
}

const removeCardFromUser = async (id, idUser) => {
  const query = "DELETE FROM Users_Cards WHERE id_user = ? AND id_card = ?";
  await pool.execute(query, [idUser, id]);
  return await getCardById(id, idUser);
}

module.exports = {
  getCards,
  getCardsBySet,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  addCardToUser,
  removeCardFromUser
};
