import { doRequest } from "../../utils/handlerCall";

process.env.TEST_ON = "1";

const mockGetRequestsByUsername = jest.fn(
  () =>
    new Promise((resolve) => {
      resolve({});
    })
);

jest.mock("../../src/models/CurrencyRequestModel", () => ({
  getInstance: () => ({
    getRequestsByUsername: mockGetRequestsByUsername,
  }),
}));

const functionName = "getResquests";

describe("Get requests", () => {
  test("Get request list - success", async () => {
    expect(
      doRequest(functionName, {
        requestContext: {
          authorizer: {
            claims: {
              username: "test@mftech.io",
            },
          },
        },
      })
    ).resolves.toHaveProperty("statusCode", 200);
  });
});
