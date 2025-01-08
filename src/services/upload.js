const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
