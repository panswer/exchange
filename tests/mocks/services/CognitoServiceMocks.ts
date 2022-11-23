import { AWSError } from "aws-sdk";
import {
  AdminCreateUserResponse,
  AdminSetUserPasswordResponse,
} from "aws-sdk/clients/cognitoidentityserviceprovider";

export const cognitoError: AWSError = {
  code: "test",
  message: "test error",
  name: "unit test",
  time: new Date(),
};

export const getSessionTokenResponseSuccessMock = {
  ChallengeParameters: {},
  AuthenticationResult: {
    AccessToken:
      "eyJraWQiOiI1U2hXOEdFQklWb0hNXC9HOTZKc2E2NzI5NmZsNTFPRHdTcnkxQU5jZUJGTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3ZTA2NTNjMi0xNDE1LTQ0ZmYtOWZmNi1lMTVmYmViMTdmNDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9PM25mOUwycXoiLCJjbGllbnRfaWQiOiJpNnUwOXRiNDBjODY5NmRxbWZwYjhuZ2YwIiwib3JpZ2luX2p0aSI6IjI3YmI4OGI5LWE4NmQtNGY1NS1iNGRiLWZmMTlkNzE3ZGI2YSIsImV2ZW50X2lkIjoiYTcyNTA4N2ItNzI0Zi00MTA0LWI1ODktMGNkNDY1M2QwNjBkIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY2NTQ5NzgxMywiZXhwIjoxNjY1NTAxNDEzLCJpYXQiOjE2NjU0OTc4MTMsImp0aSI6ImRiY2I2MTk5LTI0NDQtNDc4Yi1iYjg4LTIxY2E1Mzc1NzdkNSIsInVzZXJuYW1lIjoiN2UwNjUzYzItMTQxNS00NGZmLTlmZjYtZTE1ZmJlYjE3ZjQ1In0.ErgMCVv2y_VNFVSQceVEHca69Ft89V_qhnB9iAPNpdnTodolHk8raMsAhZa8IB7JlKnl70nNiK-bQHHiJR5T6CJ4cat2WydFyqS6fZmI4Vl7HNsNzXAodV0esNxme4nlLW9J5NhSsXyLmAUuj4KijzRE-tyRF2a6brYT98XJ_BTo4cp2NwaATWmA8CVOJGRIp9nJFIuHdVO3GThqG4zjJwFAyDsL2miPuB7Wqr7A21LaDiMy7ts7ezbCQgfF3JuWys95IxZjgGb5hFsR4vMfwqAcRTvUf3CdFGHHKsnzgOtA_oyAX7KTW_q-sr-tKHmepG6Gr-gawOFyr8y4zZG_eQ",
    ExpiresIn: 3600,
    TokenType: "Bearer",
    RefreshToken:
      "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Caizf0airI2UIi4R6JM2XywiyFbutQdw02iJAkd2OCT1HioQbwtOfZuGkdIluBW9C8cZJDIurWP-AfJNhoKbWOyt3RE4DJutXSni0T4N_6V6AyApMaUE93D9MUZpWIH457QGNtvV-ry5wGTTYRyb56cWZPAzN9r2VfyRxvH1aefdli06AOrMLB27aB3Lvn2pZAWf9eB5w0Ta_xOODr4P6d3YjNj7oi9lNMrJqy4GwTxH59UMcyhMqA2PPK3DOiLxh0eOfXbtYaF2aYZzjMrEzscxpH4eOTynttDte1q4BCpOcek3yYDs7Z31RExFy7OFFhaMRUk5LavK3O1sJo888w.MnAoPL8ixeBhQIqi.Aqcg6EtX17uP3HT3F2N6UTOAJUBhxzeDSBdJj-b-qDBbt-alFpOMe_GQ9JvS9ufN6Wof8AHZEtG1_kWLSV0BbV9ovGAl8RqIPc7hfqBk6cD_ZsyBDc6L0QJIwouYBCLtrKCNTuo_trDujGraNRHYnwTtdGVdawOfJ0A9ifiDs0Flb-SqRU3_WBfukNz_0xu3wC2e12U2H54Q-ZvHGf52-wpc9w75km5AnUM44IK_0O8-IsEVw-DuLFFotBMPJ4ZABQjmryRZoryb-Nvoe5qMczDw2zPE2Kw4lkgLmdz-C3rXWDdo-ZpMgmMgYf6g9qg6j3CKlZfwQJJxONKPSZ6SIVaKO8AykZkFBE1HFtc0c07FNYkeDtmQcGMaFjextc70ClVBcPF74BhgrTWsfgs6cqCbwwG-rUAK_X-7Uwj0FTTFRstV72fFYA2lzWPi3wHCenf1Imjx32vXbuTh-UlJ4njTXiAJb2vtoVRcJQb7fFE8Pniwsbwo2eclFxKniP3NO0Z-7SibiA-i6QbUMCDkOgoB8LaUuMC9QISwtA5zlEhYBr87orqwmLeoBn7eUTvmpmF8DWgMdpclzF3jSZ6_tZAEJkhto-cT0sECenyU0wlTgYPAW69kvC_0Qt42dJ4u8pYv9iX-sGkInPOnv5KbkonL0pz5Y8jm9qJaF2k-ioi7EE_kZz0ql528Va7jjgL-E0YMmjJApM_0s5OfxkkGbrDnfJ0Dh-QufFtNS2U0oc1QRmrPQ3cDfvUrXEJYkUaZ_OqgvKQeLsQJO0d_S5cO9d78oKpagGMCdOKSTRZi94ZuZZ-7DsP4fLwj5f3LN53_IBF_D5yRYbYE7FCNPWeHdSaiLLHOhMRBIz88Cc9tHz6V57k2wH_PB5CrssAFNLltYTHRPGrVa8-K7b7RHM-yfHbV180vzaRkNaMJpCRTcuZV927Z-MhRFFKBIMV_qNF_2nSP4i0F_Ykobt9qpSDk1Ps1bvxbSxouPj-VCIloX0MZsr0JrK5Fq-L4xUD8ITAGJRBCqX8NQ9L0Sb0KExBSxSqn7MsmKK7m1ITQiwAxKIhnmAsSZIls8zurSAGKEGY_ZbQZd8AIcn_3qPwB42Zd7x6xJxsq0ulakky3IvnANYAQkepkffKtvBSp_9BH_70dz-3IGneWex7th5PbeRj8EV08GWI3ZCvibSWF-QBz6bLEpDXChNFbsO5_QO9Gvh2rSkK4yaMeH3fI2ZvWFpSYz8ktyRbfsP9phONDxZhq2NtklVr14tZLDtBz8Dmv2vdwZmh_1eY6x-XtXd5SdWbduh7suhF1YKu9gCJRyG06PxUNT6cMYNDBX-dXrQ.cyu_LBBA7uOE3_U8mrbwxA",
    IdToken:
      "eyJraWQiOiJKWFZHdXVvNHdqaGxwMDRTSHN0eVZRSnFRcERRbnhGNFRvYWFIc0NEaVIwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZTA2NTNjMi0xNDE1LTQ0ZmYtOWZmNi1lMTVmYmViMTdmNDUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfTzNuZjlMMnF6IiwiY29nbml0bzp1c2VybmFtZSI6IjdlMDY1M2MyLTE0MTUtNDRmZi05ZmY2LWUxNWZiZWIxN2Y0NSIsIm9yaWdpbl9qdGkiOiIyN2JiODhiOS1hODZkLTRmNTUtYjRkYi1mZjE5ZDcxN2RiNmEiLCJhdWQiOiJpNnUwOXRiNDBjODY5NmRxbWZwYjhuZ2YwIiwiZXZlbnRfaWQiOiJhNzI1MDg3Yi03MjRmLTQxMDQtYjU4OS0wY2Q0NjUzZDA2MGQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY2NTQ5NzgxMywiZXhwIjoxNjY1NTAxNDEzLCJpYXQiOjE2NjU0OTc4MTMsImp0aSI6IjFmYTFjNDI3LTFhMDktNDc5MS04ZTY4LTJmZDFiMjg5YmIxYSIsImVtYWlsIjoicmljYXJkb0BtZnRlY2guaW8ifQ.Ar8Dz_8huNPtvZwQulf4qbVjRF8mKnSEN5QR0dhWeCiIuF9fbhlCUUR42uqkzRMbUxwm_HcpVoUcqm8i860L1HqQMHJWePf7AOBp-W44XlQmStxuMKAuxK1qKyNZWaFa5AY03WN9CBaQLGZSCZZYo5EpVnLeg4gBRM-AMLk426X9erO5b8IPw2NP7VsOqeebyx2T07dEGNzFi7Uasmd17XaPR11tIcR5z143md2KFRGpEzQEYf6NilyrOI0vetGdo5jq6-4qqc3NHus0WgNmE4DZnsX5IrBKvbYIe-xrJSjjgZ2e11GASxcxrYmptHW8te7D6HvJxqk0oeTEnH8woQ",
  },
};

export const createAnUserSuccessMock: AdminCreateUserResponse = {
  User: {
    Username: "1",
    Attributes: [
      {
        Name: "sub",
        Value: "1",
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "email",
        Value: "aaa@aa.aa",
      },
    ],
    UserCreateDate: new Date("2022-10-11T14:05:38.233Z"),
    UserLastModifiedDate: new Date("2022-10-11T14:05:38.233Z"),
    Enabled: true,
    UserStatus: "FORCE_CHANGE_PASSWORD",
  },
};

export const setPasswordToUserSuccessMock: AdminSetUserPasswordResponse = {};
