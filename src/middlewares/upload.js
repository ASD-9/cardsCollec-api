const path = require("path");
const multer = require("multer");
const upload = require("../services/multer.config");
const responseHandler = require("../services/response.handler");

const handleImageUpload = (req, res, next) => {
  // Extract the type from the URL and store it in req.body to use it later to select the correct folder
  req.body.type = req.baseUrl.split("/")[1];
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    if (err) {
      let errorMessage = "Erreur serveur lors de l'upload.";

      if (err instanceof multer.MulterError) {
        errorMessage = err.code === "LIMIT_FILE_SIZE"
          ? "Le fichier dépasse la taille maximale autorisée (5 Mo)."
          : "Erreur lors de l'upload.";
      }

      return responseHandler(res, err instanceof multer.MulterError ? 400 : 500, errorMessage, null, err);
    }

    if (!req.file) {
      return responseHandler(res, 400, "Aucun fichier envoyé.", null, "Aucun fichier envoyé.");
    }

    // Add the image path to req.body to use it later to save it in the database
    req.body.image = path.join("public/images", req.body.type, req.file.filename);
    next();
  });
}

module.exports = handleImageUpload;
