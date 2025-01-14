const usersRouter = require("./users/users.router");
const rolesRouter = require("./roles/roles.router");
const raritiesRouter = require("./rarities/rarities.router");
const avatarsRouter = require("./avatars/avatars.router");
const collectionsRouter = require("./collections/collections.router");
const setsRouter = require("./sets/sets.router");

module.exports = {
  usersRouter,
  rolesRouter,
  raritiesRouter,
  avatarsRouter,
  collectionsRouter,
  setsRouter
};
