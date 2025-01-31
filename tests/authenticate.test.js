const usersService = require("../src/users/users.service");
const responseHandler = require("../src/services/response.handler");
const jwt = require("jsonwebtoken");
const authenticate = require("../src/middlewares/authenticate");

jest.mock("../src/users/users.service"); // Mock the usersService
jest.mock("../src/services/response.handler"); // Mock the response handler
jest.mock("jsonwebtoken"); // Mock the jwt module

describe("authenticate middleware", () => {
  let req, next;

  // Set up mocks before each test
  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer token"
      }
    };
    next = jest.fn();
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if token is missing", async () => {
    req = {
      headers: {}
    };

    await authenticate(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith({}, 401, "Token manquant");
  });

  it("should return 401 if token is invalid", async () => {
    const mockError = new Error("Invalid token");
    // jwt.verify.mockRejectedValue(mockError);
    jwt.verify.mockImplementation(() => {
      throw mockError;
    });

    await authenticate(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith({}, 401, "Une erreur est survenue lors de l'authentification", null, mockError);
  });

  it("should return 401 if user is not found", async () => {
    jwt.verify.mockImplementation(() => {
      return { id_user: 1 };
    });
    usersService.getUserRole.mockResolvedValue(null);

    await authenticate(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(usersService.getUserRole).toHaveBeenCalledWith(1);
    expect(responseHandler).toHaveBeenCalledWith({}, 401, "Utilisateur non trouvé");
  });

  it("should set req.user with user data and call next", async () => {
    jwt.verify.mockImplementation(() => {
      return { id_user: 1 };
    });
    usersService.getUserRole.mockResolvedValue({
      id_role: 1,
      name: "Admin"
    });

    await authenticate(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(usersService.getUserRole).toHaveBeenCalledWith(1);
    expect(req.user).toEqual({
      id_user: 1,
      role: {
        id_role: 1,
        name: "Admin"
      }
    });
  });
});
