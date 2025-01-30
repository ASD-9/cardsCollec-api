const pool = require("../services/database");

const getRoles = async () => {
  const query = "SELECT * FROM Roles";
  const [rows] = await pool.execute(query);
  return rows;
}

const getRoleById = async (id) => {
  const query = "SELECT * FROM Roles WHERE id_role = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

const createRole = async (roleData) => {
  const query = "INSERT INTO Roles (name) VALUES (?)";
  const [result] = await pool.execute(query, [roleData.name]);
  return { id_role: result.insertId, ...roleData };
}

const updateRole = async (id, roleData) => {
  const query = "UPDATE Roles SET name = ? WHERE id_role = ?";
  const [result] = await pool.execute(query, [roleData.name, id]);
  return result.affectedRows > 0 ? { id_role: id, ...roleData } : null; // Check if the role was found
}

const deleteRole = async (id) => {
  const query = "DELETE FROM Roles WHERE id_role = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0 ? true : null; // Check if the role was found
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
}
