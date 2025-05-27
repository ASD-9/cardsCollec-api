const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const authenticate = require("./middlewares/authenticate");
const authorize = require("./middlewares/authorize");

const app = express();

// Disabling the “X-Powered-By” header for security reasons
app.disable("x-powered-by");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/images", express.static("public/images"));

// Routes
app.use("/auth", routes.authRouter);
app.use("/users", authenticate, authorize("Admin"), routes.usersRouter);
app.use("/roles", authenticate, authorize("Admin"), routes.rolesRouter);
app.use("/rarities", authenticate, routes.raritiesRouter);
app.use("/avatars", routes.avatarsRouter);
app.use("/collections", authenticate, routes.collectionsRouter);
app.use("/sets", authenticate, routes.setsRouter);
app.use("/cards", authenticate, routes.cardsRouter);

module.exports = app;
