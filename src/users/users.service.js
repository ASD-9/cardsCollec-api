const pool = require("../services/database");
const { hashPassword } = require("../services/hashing");

// Function to format user data for consistency
const formatUserData = (row) => {
  return {
    id_user: row.id_user,
    username: row.username,
    password: row.password,
    role: {
      id_role: row.id_role,
      name: row.role_name
    },
    avatar: {
      id_avatar: row.id_avatar,
      name: row.avatar_name
    }
  };
}

const getUsers = async () => {
  const query = `
    SELECT 
      u.*, r.id_role, r.name as role_name, a.id_avatar, a.name as avatar_name
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    INNER JOIN Avatars a ON u.id_avatar = a.id_avatar
  `;
  const [rows] = await pool.execute(query);
  return rows.map(row => formatUserData(row));
}

const getUserById = async (id) => {
  const query = `
    SELECT
      u.*, r.id_role, r.name as role_name, a.id_avatar, a.name as avatar_name
    FROM Users u
    INNER JOIN Roles r ON u.id_role = r.id_role
    INNER JOIN Avatars a ON u.id_avatar = a.id_avatar
    WHERE u.id_user = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? formatUserData(rows[0]) : null;
}

const createUser = async (userData) => {
  userData.password = await hashPassword(userData.password); // Hash the password before saving
  const query = `INSERT INTO Users (username, password, id_role, id_avatar) VALUES (?, ?, ?, ?)`;
  const [result] = await pool.execute(query, [userData.username, userData.password, userData.id_role, userData.id_avatar]);
  return await getUserById(result.insertId);
}

const updateUser = async (id, userData) => {
  // Hash the password if it's provided before updating
  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }
  // Construct the update query
  const updates = Object.keys(userData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(userData), id];
  const query = `UPDATE Users SET ${updates} WHERE id_user = ?`;

  const [result] = await pool.execute(query, values);
  // Check the affected rows to determine if the user was found
  if (result.affectedRows === 0) {
    return null;
  }
  return await getUserById(id);
}

const deleteUser = async (id) => {
  const query = `DELETE FROM Users WHERE id_user = ?`;
  const [result] = await pool.execute(query, [id]);
  // Check the affected rows to determine if the user was found
  if (result.affectedRows === 0) {
    return null;
  }
  return true;
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}
