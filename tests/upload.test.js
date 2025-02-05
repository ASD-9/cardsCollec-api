const handleImageUpload = require("../src/middlewares/upload");
const upload = require("../src/services/multer.config");
const responseHandler = require("../src/services/response.handler");
const path = require("path");
const multer = require("multer");

jest.mock("../src/services/multer.config"); // Mock the multer configuration
jest.mock("../src/services/response.handler"); // Mock the response handler

describe("Test upload middleware", () => {
  let req, next;

  // Set up mocks before each test
  beforeEach(() => {
    req = {
      baseUrl: "/collections",
      body: {}
    };
    next = jest.fn();
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if image is uploaded", () => {
    upload.single = jest.fn(() => (req, res, next) => {
      req.file = { filename: "test.png" };
      req.body.type = "collections";
      next();
    });

    handleImageUpload(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith("image");
    expect(req.body.image_path).toEqual(path.join("images", "collections", req.file.filename));
  });

  it("should call responseHandler with error 400 if no image is uploaded", () => {
    upload.single = jest.fn(() => (req, res, next) => next());

    handleImageUpload(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith("image");
    expect(responseHandler).toHaveBeenCalledWith({}, 400, "Aucun fichier envoyé.", null, "Aucun fichier envoyé.");
  });

  it("should call responseHandler with error 400 if image size is too large", () => {
    const multerError = new multer.MulterError("LIMIT_FILE_SIZE");

    upload.single = jest.fn(() => (req, res, next) => next(multerError));

    handleImageUpload(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith("image");
    expect(responseHandler).toHaveBeenCalledWith({}, 400, "Le fichier dépasse la taille maximale autorisée (5 Mo).", null, multerError);
  });

  it("should call responseHandler with error 500 if image upload fails", () => {
    const error = new Error("Image upload failed");

    upload.single = jest.fn(() => (req, res, next) => next(error));

    handleImageUpload(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith("image");
    expect(responseHandler).toHaveBeenCalledWith({}, 500, "Erreur serveur lors de l'upload.", null, error);
  });

  it("should call responseHandler with error 400 if image upload fails with multer error", () => {
    const multerError = new multer.MulterError();

    upload.single = jest.fn(() => (req, res, next) => next(multerError));

    handleImageUpload(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith("image");
    expect(responseHandler).toHaveBeenCalledWith({}, 400, "Erreur lors de l'upload.", null, multerError);
  });
});
