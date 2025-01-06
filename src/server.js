const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = server;
