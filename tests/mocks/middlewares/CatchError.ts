export const requestWithBody = {
  event: {
    body: {
      data: "test",
    },
  },
  error: new Error("Test with body"),
  context: {},
};

export const requestWithoutBody = {
  error: new Error("Test without body"),
  event: {},
  context: {},
};
