const responseHandler = require("../src/services/response.handler");

describe("Test Response Handler", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn(),
      json: jest.fn(),
    };
  });

  it("should return success true for 2xx code", () => {
    const statusCode = 200;
    const message = "Success Request";
    const data = { id: 1 };

    responseHandler(res, statusCode, message, data);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Success Request",
      data: { id: 1 },
      error: null
    });
  });

  it("should return success false for 4xx code", () => {
    const statusCode = 400;
    const message = "Bad Request";
    const error = { message: "Invalid Request" };

    responseHandler(res, statusCode, message, null, error);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Bad Request",
      data: null,
      error: { message: "Invalid Request" }
    });
  });
});
