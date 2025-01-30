const express = require("express");
const routes = require("./routes");
const upload = require("./services/multer.config");

const app = express();

// Disabling the “X-Powered-By” header for security reasons
app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/images', express.static('public/images'));

// Routes
app.use("/users", routes.usersRouter);
app.use("/roles", routes.rolesRouter);
app.use("/rarities", routes.raritiesRouter);
app.use("/avatars", routes.avatarsRouter);
app.use("/collections", routes.collectionsRouter);
app.use("/sets", routes.setsRouter);
app.use("/cards", routes.cardsRouter);

module.exports = app;
