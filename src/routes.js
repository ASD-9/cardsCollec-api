const authRouter = require("./auth/auth.router");
const usersRouter = require("./users/users.router");
const rolesRouter = require("./roles/roles.router");
const raritiesRouter = require("./rarities/rarities.router");
const avatarsRouter = require("./avatars/avatars.router");
const collectionsRouter = require("./collections/collections.router");
const setsRouter = require("./sets/sets.router");
const cardsRouter = require("./cards/cards.router");

module.exports = {
  authRouter,
  usersRouter,
  rolesRouter,
  raritiesRouter,
  avatarsRouter,
  collectionsRouter,
  setsRouter,
  cardsRouter
};
