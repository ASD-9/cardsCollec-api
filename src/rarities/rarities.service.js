const pool = require("../services/database");

const getRarities = async () => {
  const query = "SELECT * FROM Rarities";
  const [rows] = await pool.execute(query);
  return rows;
}

const getRaritiesByCollection = async (idCollection) => {
  const query = "SELECT * FROM Rarities WHERE id_collection = ?";
  const [rows] = await pool.execute(query, [idCollection]);
  return rows;
}

const getRarityById = async (id) => {
  const query = "SELECT * FROM Rarities WHERE id_rarity = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

const createRarity = async (rarityData) => {
  const query = "INSERT INTO Rarities (name, abbreviated_name, rank, id_collection) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [rarityData.name, rarityData.abbreviated_name, rarityData.rank, rarityData.id_collection]);
  return { id_rarity: result.insertId, ...rarityData };
}

const updateRarity = async (id, rarityData) => {
  // Construct the update query
  const updates = Object.keys(rarityData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(rarityData), id];
  const query = `UPDATE Rarities SET ${updates} WHERE id_rarity = ?`;

  const [result] = await pool.execute(query, values);
  // Check the affected rows to determine if the rarity was found
  if (result.affectedRows === 0) {
    return null;
  }
  return await getRarityById(id);
}

const deleteRarity = async (id) => {
  const query = "DELETE FROM Rarities WHERE id_rarity = ?";
  const [result] = await pool.execute(query, [id]);
  // Check the affected rows to determine if the rarity was found
  if (result.affectedRows === 0) {
    return null;
  }
  return true;
}

module.exports = {
  getRarities,
  getRaritiesByCollection,
  getRarityById,
  createRarity,
  updateRarity,
  deleteRarity
}
