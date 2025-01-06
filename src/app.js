const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bonjour Monde!" });
});

module.exports = app;
