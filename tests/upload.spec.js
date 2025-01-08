const path = require("path");
const upload = require("../src/services/upload");

describe("Test Multer Configuration", () => {
  const reqCollection = { params: { "type": "collections", "name": "Collection" } };
  const reqSet = { params: { "type": "sets", "name": "Set", "id_collection": 1 } };
  const reqCard = { params: { "type": "cards", "number": 1, "id_rarity": 1, "id_set": 1 } };
  const reqAvatar = { params: { "type": "avatars", "name": "Avatar" } };
  const file = { originalname: "test-image.png", mimetype: "image/png" };

  const cb = jest.fn();

  it("should select the correct upload storage based on the type", () => {
    const destinationCallback = upload.storage.getDestination;
    destinationCallback(reqCollection, file, cb);
    destinationCallback(reqSet, file, cb);
    destinationCallback(reqCard, file, cb);
    destinationCallback(reqAvatar, file, cb);

    const expectedPathCollection = path.join(process.cwd(), "images", "collections");
    const expectedPathSet = path.join(process.cwd(), "images", "sets");
    const expectedPathCard = path.join(process.cwd(), "images", "cards");
    const expectedPathAvatar = path.join(process.cwd(), "images", "avatars");

    expect(cb).toHaveBeenCalledWith(null, expectedPathCollection);
    expect(cb).toHaveBeenCalledWith(null, expectedPathSet);
    expect(cb).toHaveBeenCalledWith(null, expectedPathCard);
    expect(cb).toHaveBeenCalledWith(null, expectedPathAvatar);
  });

  it("should generate the correct filename", () => {
    const filenameCallback = upload.storage.getFilename;
    filenameCallback(reqCollection, file, cb);
    filenameCallback(reqSet, file, cb);
    filenameCallback(reqCard, file, cb);
    filenameCallback(reqAvatar, file, cb);

    const expectedFilenameCollection = "Collection.png";
    const expectedFilenameSet = "1-Set.png";
    const expectedFilenameCard = "1-1-1.png";
    const expectedFilenameAvatar = "Avatar.png";

    expect(cb).toHaveBeenCalledWith(null, expectedFilenameCollection);
    expect(cb).toHaveBeenCalledWith(null, expectedFilenameSet);
    expect(cb).toHaveBeenCalledWith(null, expectedFilenameCard);
    expect(cb).toHaveBeenCalledWith(null, expectedFilenameAvatar);
  });

  it('should accept allowed mimetypes', () => {
    const fileFilter = upload.fileFilter;
    fileFilter(req, file, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('should reject unsupported mimetypes', () => {
    const fileFilter = upload.fileFilter;
    const invalidFile = { mimetype: 'application/pdf' };
    fileFilter(req, invalidFile, cb);
    expect(cb).toHaveBeenCalledWith(new Error('Type de fichier non supporté. Seuls les JPEG et PNG sont autorisés.'));
  });
});
