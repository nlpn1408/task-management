"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/authController.ts
var authController_exports = {};
__export(authController_exports, {
  default: () => authController_default,
  registerUser: () => registerUser,
  signin: () => signin,
  startLogin: () => startLogin,
  verifyOtp: () => verifyOtp
});
module.exports = __toCommonJS(authController_exports);
var import_client_cognito_identity_provider = require("@aws-sdk/client-cognito-identity-provider");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var client = new import_client_cognito_identity_provider.CognitoIdentityProviderClient({ region: "ap-southeast-1" });
var USER_POOL_ID = process.env.USER_POOL_ID;
var CLIENT_ID = process.env.CLIENT_ID;
var docClient = import_lib_dynamodb.DynamoDBDocumentClient.from(new import_client_dynamodb.DynamoDBClient({}));
var USERS_TABLE = process.env.USERS_TABLE || "Users";
var checkUserInDB = async (phone) => {
  try {
    const normalizedPhone = phone.startsWith("+") ? phone : `+84${phone.replace(/^0/, "")}`;
    const result = await docClient.send(
      new import_lib_dynamodb.GetCommand({
        TableName: USERS_TABLE,
        Key: { phone: normalizedPhone }
      })
    );
    return !!result.Item;
  } catch (error) {
    console.error("\u{1F680} ~ checkUserInDB ~ error:", error);
    return false;
  }
};
var startLogin = async (event) => {
  try {
    const { username } = JSON.parse(event.body || "{}");
    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone number is required" })
      };
    }
    const normalizedPhone = `+${username}`;
    const userExists = await checkUserInDB(normalizedPhone);
    console.log("\u{1F680} ~ startLogin ~ userExists:", userExists);
    if (userExists) {
      return {
        statusCode: 200,
        body: JSON.stringify({ step: "PASSWORD", data: true, success: true })
      };
    } else {
      try {
        await client.send(
          new import_client_cognito_identity_provider.AdminCreateUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: normalizedPhone,
            DesiredDeliveryMediums: ["SMS"],
            ForceAliasCreation: false
          })
        );
        console.log("\u{1F680} ~ startLogin ~ user created:", normalizedPhone);
      } catch (createError) {
        console.error("\u{1F680} ~ startLogin ~ createUser error:", createError);
        if (createError.name !== "UsernameExistsException") throw createError;
      }
      const command = new import_client_cognito_identity_provider.AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: "CUSTOM_AUTH",
        AuthParameters: { USERNAME: normalizedPhone }
      });
      console.log("\u{1F680} ~ startLogin ~ command input:", command.input);
      const response = await client.send(command);
      console.log("\u{1F680} ~ startLogin ~ response:", response);
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: "false",
          success: true,
          session: response.Session
        })
      };
    }
  } catch (error) {
    console.error("\u{1F680} ~ startLogin ~ error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Login initiation failed",
        details: error.message
      })
    };
  }
};
var verifyOtp = async (event) => {
  try {
    const { username, code, session } = JSON.parse(event.body || "{}");
    if (!username || !code || !session) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone, OTP, and session are required" })
      };
    }
    const normalizedPhone = `+${username}`;
    const command = new import_client_cognito_identity_provider.AdminRespondToAuthChallengeCommand({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
      ChallengeName: "CUSTOM_CHALLENGE",
      Session: session,
      ChallengeResponses: { USERNAME: normalizedPhone, ANSWER: code }
    });
    const response = await client.send(command);
    console.log("\u{1F680} ~ verifyOtp ~ response:", response);
    if (response.AuthenticationResult) {
      return {
        statusCode: 200,
        body: JSON.stringify({ step: "REGISTER", session })
      };
    } else if (response.ChallengeName === "CUSTOM_CHALLENGE") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid OTP, please try again",
          session: response.Session
        })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "OTP verification failed, unexpected response"
        })
      };
    }
  } catch (error) {
    console.error("\u{1F680} ~ verifyOtp ~ error:", error);
    if (error.name === "NotAuthorizedException") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid OTP, please try again",
          details: error.message
        })
      };
    } else if (error.name === "InvalidSessionException") {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Session expired or invalid, please restart login",
          details: error.message
        })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message
      })
    };
  }
};
var registerUser = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body || "{}");
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone and password are required" })
      };
    }
    const normalizedPhone = `+${username}`;
    await client.send(
      new import_client_cognito_identity_provider.AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: normalizedPhone,
        Password: password,
        Permanent: true
      })
    );
    await docClient.send(
      new import_lib_dynamodb.PutCommand({
        TableName: USERS_TABLE,
        Item: {
          phone: normalizedPhone,
          registeredAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ step: "PASSWORD", data: true, success: true })
    };
  } catch (error) {
    console.error("\u{1F680} ~ registerUser ~ error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Registration failed",
        details: error.message
      })
    };
  }
};
var signin = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body || "{}");
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username and password are required" })
      };
    }
    const normalizedPhone = `+${username}`;
    const command = new import_client_cognito_identity_provider.AdminInitiateAuthCommand({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: normalizedPhone,
        PASSWORD: password
      }
    });
    const response = await client.send(command);
    console.log("\u{1F680} ~ signin ~ response:", response);
    if (response.AuthenticationResult) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          step: "SUCCESS",
          tokens: {
            accessToken: response.AuthenticationResult.AccessToken,
            idToken: response.AuthenticationResult.IdToken,
            refreshToken: response.AuthenticationResult.RefreshToken
          }
        })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Authentication failed, unexpected response"
        })
      };
    }
  } catch (error) {
    console.error("\u{1F680} ~ signin ~ error:", error);
    if (error.name === "NotAuthorizedException") {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Invalid phone or password",
          details: error.message
        })
      };
    } else if (error.name === "UserNotFoundException") {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "User not found",
          details: error.message
        })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message
      })
    };
  }
};
var authController_default = {
  startLogin,
  verifyOtp,
  registerUser
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerUser,
  signin,
  startLogin,
  verifyOtp
});
//# sourceMappingURL=authController.js.map
