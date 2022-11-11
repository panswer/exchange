export const middlewareGoodRequest = {
  event: {
    body: {
      from: "USD",
      to: "EUR",
      amount: 10,
    },
  },
};

export const middlewareBadRequest = {
  event: {
    body: {
      from: "USD",
      to: "EUR",
    },
  },
};
