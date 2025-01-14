const avatarsController = require("./avatars.controller");
const avatarsService = require("./avatars.service");
const responseHandler = require("../services/response.handler");

jest.mock("./avatars.service"); // Mock the avatarsService
jest.mock("../services/response.handler"); // Mock the response handler

// Mock avatars data
const mockAvatar = {
  id_avatar: 1,
  name: "Avatar1",
  image_path: "path/to/avatar1.png"
};

const mockAvatar2 = {
  id_avatar: 2,
  name: "Avatar2",
  image_path: "path/to/avatar2.png"
};

describe("Test Avatars Controller", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvatars", () => {
    it("should return a list of avatars with status 200", async () => {
      const mockAvatars = [mockAvatar, mockAvatar2];
      avatarsService.getAvatars.mockResolvedValue(mockAvatars);

      await avatarsController.getAvatars({}, {});

      expect(avatarsService.getAvatars).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Avatars récupérés avec succès", mockAvatars);
    });

    it("should return an error with status 500", async () => {
      const mockError = new Error("Database error");
      avatarsService.getAvatars.mockRejectedValue(mockError);

      await avatarsController.getAvatars({}, {});

      expect(avatarsService.getAvatars).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération des avatars", null, mockError);
    });
  });

  describe("getAvatarById", () => {
    it("should return an avatar with status 200", async () => {
      const mockReq = { params: { id: 1 } };
      avatarsService.getAvatarById.mockResolvedValue(mockAvatar);

      await avatarsController.getAvatarById(mockReq, {});

      expect(avatarsService.getAvatarById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Avatar récupéré avec succès", mockAvatar);
    });

    it("should return an error with status 404 if avatar not found", async () => {
      const mockReq = { params: { id: 99 } };
      avatarsService.getAvatarById.mockResolvedValue(null);

      await avatarsController.getAvatarById(mockReq, {});

      expect(avatarsService.getAvatarById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Avatar non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      avatarsService.getAvatarById.mockRejectedValue(mockError);

      await avatarsController.getAvatarById(mockReq, {});

      expect(avatarsService.getAvatarById).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la récupération de l'avatar", null, mockError);
    });
  });

  describe("createAvatar", () => {
    it("should return the new avatar with status 201", async () => {
      const mockReq = { body: { name: "Avatar1", image_path: "path/to/avatar1.png" } };
      avatarsService.createAvatar.mockResolvedValue(mockAvatar);

      await avatarsController.createAvatar(mockReq, {});

      expect(avatarsService.createAvatar).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 201, "Avatar créé avec succès", mockAvatar);
    });

    it("should return an error with status 500", async () => {
      const mockReq = { body: { name: "Avatar1", image_path: "path/to/avatar1.png" } };
      const mockError = new Error("Database error");
      avatarsService.createAvatar.mockRejectedValue(mockError);

      await avatarsController.createAvatar(mockReq, {});

      expect(avatarsService.createAvatar).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la création de l'avatar", null, mockError);
    });
  });

  describe("updateAvatar", () => {
    it("should return the updated avatar with status 200", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Avatar1" } };
      avatarsService.updateAvatar.mockResolvedValue(mockAvatar);

      await avatarsController.updateAvatar(mockReq, {});

      expect(avatarsService.updateAvatar).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Avatar mis à jour avec succès", mockAvatar);
    });

    it("should return an error with status 400 if no data provided", async () => {
      const mockReq = { params: { id: 1 } };

      await avatarsController.updateAvatar(mockReq, {});

      expect(avatarsService.updateAvatar).not.toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith({}, 400, "Données manquantes");
    });

    it("should return an error with status 404 if avatar not found", async () => {
      const mockReq = { params: { id: 99 }, body: { name: "Avatar1" } };
      avatarsService.updateAvatar.mockResolvedValue(null);

      await avatarsController.updateAvatar(mockReq, {});

      expect(avatarsService.updateAvatar).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Avatar non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 }, body: { name: "Avatar1" } };
      const mockError = new Error("Database error");
      avatarsService.updateAvatar.mockRejectedValue(mockError);

      await avatarsController.updateAvatar(mockReq, {});    
      expect(avatarsService.updateAvatar).toHaveBeenCalledWith(mockReq.params.id, mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la mise à jour de l'avatar", null, mockError);
    });
  });

  describe("deleteAvatar", () => {
    it("should return status 200", async () => {
      const mockReq = { params: { id: 1 } };
      avatarsService.deleteAvatar.mockResolvedValue(true);

      await avatarsController.deleteAvatar(mockReq, {});

      expect(avatarsService.deleteAvatar).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 200, "Avatar supprimé avec succès");
    });

    it("should return an error with status 404 if avatar not found", async () => {
      const mockReq = { params: { id: 99 } };
      avatarsService.deleteAvatar.mockResolvedValue(null);

      await avatarsController.deleteAvatar(mockReq, {});

      expect(avatarsService.deleteAvatar).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 404, "Avatar non trouvé");
    });

    it("should return an error with status 500", async () => {
      const mockReq = { params: { id: 1 } };
      const mockError = new Error("Database error");
      avatarsService.deleteAvatar.mockRejectedValue(mockError);

      await avatarsController.deleteAvatar(mockReq, {});

      expect(avatarsService.deleteAvatar).toHaveBeenCalledWith(mockReq.params.id);
      expect(responseHandler).toHaveBeenCalledWith({}, 500, "Une erreur est survenue lors de la suppression de l'avatar", null, mockError);
    });
  });
});
