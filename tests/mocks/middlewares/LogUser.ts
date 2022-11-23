import { requestContextSuccessMock } from "../generic/request";

export const middlewareGoodRequestMock = {
  event: {
    requestContext: requestContextSuccessMock,
  },
  context: {},
};

export const middlewareBadRequestMock = {
  event: {
    requestContext: {
      authorizer: {},
    },
  },
  context: {},
};
