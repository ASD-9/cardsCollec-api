const pool = require("../services/database");

const getCollections = async () => {
  const query = "SELECT * FROM Collections";
  const [rows] = await pool.execute(query);
  return rows;
}

const getCollectionById = async (id) => {
  const query = "SELECT * FROM Collections WHERE id_collection = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

const createCollection = async (collectionData) => {
  const query = "INSERT INTO Collections (name, image_path) VALUES (?, ?)";
  const [result] = await pool.execute(query, [collectionData.name, collectionData.image_path]);
  return { id_collection: result.insertId, ...collectionData };
}

const updateCollection = async (id, collectionData) => {
  const query = "UPDATE Collections SET name = ? WHERE id_collection = ?";
  const [result] = await pool.execute(query, [collectionData.name, id]);
  // Check the affected rows to determine if the collection was found
  if (result.affectedRows === 0) {
    return null;
  }
  return await getCollectionById(id);
}

const deleteCollection = async (id) => {
  const query = "DELETE FROM Collections WHERE id_collection = ?";
  const [result] = await pool.execute(query, [id]);
  // Check the affected rows to determine if the collection was found
  if (result.affectedRows === 0) {
    return null;
  }
  return true;
}

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};