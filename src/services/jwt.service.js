const generateAccessToken = (idUser) => {
  const payload = {
    id_user: idUser
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  return accessToken;
}

const generateRefreshToken = (idUser) => {
  const payload = {
    id_user: idUser
  };
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  return refreshToken;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
}
