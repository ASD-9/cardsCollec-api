const express = require("express");
const app = express();

// Disabling the “X-Powered-By” header for security reasons
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bonjour Monde!" });
});

module.exports = app;
