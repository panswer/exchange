export const requestWithBodyMock = {
  event: {
    body: {
      data: "test",
    },
  },
  error: new Error("Test with body"),
  context: {},
};

export const requestWithoutBodyMock = {
  error: new Error("Test without body"),
  event: {},
  context: {},
};
