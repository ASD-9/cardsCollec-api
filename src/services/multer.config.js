const multer = require('multer');
const path = require('path');

// Generate the filename based on the type
const generateFilename = (req) => {
  const { type } = req.body;
  if (type === 'collections') {
    return req.body.name;
  } else if (type === 'sets') {
    return `${req.body.id_collection}-${req.body.name}`;
  } else if (type === 'cards') {
    return `${req.body.id_set}-${req.body.id_rarity}-${req.body.number}`;
  } else if (type === 'avatars') {
    return req.body.name;
  }
}

const storage = multer.diskStorage({
  // Set the destination folder based on the type
  destination: (req, file, cb) => {
    const { type } = req.body;
    const uploadPath = path.join(process.cwd(), 'public/images', type);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(req);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${filename}${fileExtension}`);
  }
});

// Check if the mimetype is allowed
const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ['image/jpeg', 'image/png'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seuls les JPEG et PNG sont autorisés.'));
  }
};

// Set the file size limit (5 Mo)
const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;
