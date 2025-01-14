const express = require("express");
const { usersRouter, rolesRouter, raritiesRouter, avatarsRouter, collectionsRouter, setsRouter } = require("./routes");
const upload = require("./services/multer.config");

const app = express();

// Disabling the “X-Powered-By” header for security reasons
app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/images', express.static('public/images'));

// Routes
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/rarities", raritiesRouter);
app.use("/avatars", avatarsRouter);
app.use("/collections", collectionsRouter);
app.use("/sets", setsRouter);

module.exports = app;
