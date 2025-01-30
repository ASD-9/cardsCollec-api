const pool = require("../services/database");

const getSets = async () => {
  const query = "SELECT * FROM Sets";
  const [rows] = await pool.execute(query);
  return rows;
}

const getSetsByCollection = async (idCollection) => {
  const query = "SELECT * FROM Sets WHERE id_collection = ?";
  const [rows] = await pool.execute(query, [idCollection]);
  return rows;
}

const getSetById = async (id) => {
  const query = "SELECT * FROM Sets WHERE id_set = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

const createSet = async (setData) => {
  const query = "INSERT INTO Sets (name, image_path, id_collection) VALUES (?, ?, ?)";
  const [result] = await pool.execute(query, [setData.name, setData.image_path, setData.id_collection]);
  return { id_set: result.insertId, ...setData };
}

const updateSet = async (id, setData) => {
  // Construct the query
  const updates = Object.keys(setData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(setData), id];
  const query = `UPDATE Sets SET ${updates} WHERE id_set = ?`;

  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0 ? await getSetById(id) : null; // Check if the set was found
}

const deleteSet = async (id) => {
  const query = "DELETE FROM Sets WHERE id_set = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0 ? true : null; // Check if the set was found
}

module.exports = {
  getSets,
  getSetsByCollection,
  getSetById,
  createSet,
  updateSet,
  deleteSet,
};
