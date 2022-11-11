export const signInResponseSuccess = {
  ChallengeParameters: {},
  AuthenticationResult: {
    AccessToken: "aaa.aaa.aaa",
    ExpiresIn: 3600,
    TokenType: "Bearer",
    RefreshToken: "bbb.bbb.bbb",
    IdToken: "ccc.ccc.ccc",
  },
};

export const signInRequestSuccess = {
  email: "ricardo@mftech.io",
  password: "Ricardo.1",
};

export const signInRequestBad = {
  email: "ricardo@mftech.io",
}