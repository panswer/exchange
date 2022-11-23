export const middlewareGoodRequestMock = {
  event: {
    body: {
      from: "USD",
      to: "EUR",
      amount: 10,
    },
  },
};

export const middlewareBadRequestMock = {
  event: {
    body: {
      from: "USD",
      to: "EUR",
    },
  },
};
