const express = require("express");
const { usersRouter } = require("./routes");

const app = express();

// Disabling the “X-Powered-By” header for security reasons
app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);

module.exports = app;
