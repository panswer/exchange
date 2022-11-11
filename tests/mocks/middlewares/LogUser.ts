import { requestContextSuccessMock } from "../generic/request";

export const middlewareGoodRequest = {
  event: {
    requestContext: requestContextSuccessMock,
  },
  context: {},
};

export const middlewareBadRequest = {
  event: {
    requestContext: {
      authorizer: {},
    },
  },
  context: {},
};
