const authorize = require("../src/middlewares/authorize");
const responseHandler = require("../src/services/response.handler");

jest.mock("../src/services/response.handler"); // Mock the response handler

describe("authorize middleware", () => {
  let req, next;

  // Set up mocks before each test
  beforeEach(() => {
    req = {
      user: {
        role: {
          name: "Admin"
        }
      }
    };
    next = jest.fn();
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if user has an authorized role", () => {
    const middleware = authorize("Admin");

    middleware(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(responseHandler).not.toHaveBeenCalled();
  });

  it("should return 403 if user does not have an authorized role", () => {
    const middleware = authorize("User");

    middleware(req, {}, next);

    expect(next).not.toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith({}, 403, "Accès non autorisé");
  });
});
