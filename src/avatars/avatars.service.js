const pool = require("../services/database");

const getAvatars = async () => {
  const query = "SELECT * FROM Avatars";
  const [rows] = await pool.execute(query);
  return rows;
}

const getAvatarById = async (id) => {
  const query = "SELECT * FROM Avatars WHERE id_avatar = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

const createAvatar = async (avatarData) => {
  const query = "INSERT INTO Avatars (name, image_path) VALUES (?, ?)";
  const [result] = await pool.execute(query, [avatarData.name, avatarData.image_path]);
  return { id_avatar: result.insertId, ...avatarData };
}

const updateAvatar = async (id, avatarData) => {
  const query = "UPDATE Avatars SET name = ? WHERE id_avatar = ?";
  const [result] = await pool.execute(query, [avatarData.name, id]);
  return result.affectedRows > 0 ? await getAvatarById(id) : null; // Check if the avatar was found
}

const deleteAvatar = async (id) => {
  const query = "DELETE FROM Avatars WHERE id_avatar = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0 ? true : null; // Check if the avatar was found
}

module.exports = {
  getAvatars,
  getAvatarById,
  createAvatar,
  updateAvatar,
  deleteAvatar
};
