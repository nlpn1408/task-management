import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new CognitoIdentityProviderClient({ region: "ap-southeast-1" });

const USER_POOL_ID = process.env.USER_POOL_ID!;
const CLIENT_ID = process.env.CLIENT_ID!;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const USERS_TABLE = process.env.USERS_TABLE || "Users";

// Hardcoded OTP for testing
const HARD_CODED_OTP = "1111";

const checkUserInDB = async (phone: string): Promise<boolean> => {
  try {
    const normalizedPhone = phone.startsWith("+")
      ? phone
      : `+84${phone.replace(/^0/, "")}`;
    const result = await docClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { phone: normalizedPhone },
      })
    );
    return !!result.Item;
  } catch (error) {
    console.error("🚀 ~ checkUserInDB ~ error:", error);
    return false;
  }
};

export const startLogin = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { username } = JSON.parse(event.body || "{}") as {
      username?: string;
    };
    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone number is required" }),
      };
    }

    // const normalizedPhone = username.startsWith("+")
    //   ? username
    //   : `+84${username.replace(/^0/, "")}`;
    // console.log("🚀 ~ startLogin ~ normalizedPhone:", normalizedPhone);
    const normalizedPhone = `+${username}`;

    const userExists = await checkUserInDB(normalizedPhone);
    console.log("🚀 ~ startLogin ~ userExists:", userExists);

    if (userExists) {
      return {
        statusCode: 200,
        body: JSON.stringify({ step: "PASSWORD", data: true, success: true }),
      };
    } else {
      // Tạo người dùng mới trong Cognito
      try {
        await client.send(
          new AdminCreateUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: normalizedPhone,
            DesiredDeliveryMediums: ["SMS"],
            ForceAliasCreation: false,
          })
        );
        console.log("🚀 ~ startLogin ~ user created:", normalizedPhone);
      } catch (createError: any) {
        console.error("🚀 ~ startLogin ~ createUser error:", createError);
        if (createError.name !== "UsernameExistsException") throw createError;
      }

      // Khởi tạo luồng OTP
      const command = new AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: "CUSTOM_AUTH",
        AuthParameters: { USERNAME: normalizedPhone },
      });
      console.log("🚀 ~ startLogin ~ command input:", command.input);
      const response = await client.send(command);
      console.log("🚀 ~ startLogin ~ response:", response);

      // return {
      //   statusCode: 200,
      //   body: JSON.stringify({ data: "OTP", session: response.Session }),
      // };

      return {
        statusCode: 200,
        body: JSON.stringify({
          data: "false",
          success: true,
          session: response.Session,
        }),
      };
    }
  } catch (error: any) {
    console.error("🚀 ~ startLogin ~ error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Login initiation failed",
        details: error.message,
      }),
    };
  }
};

// 2. Verify OTP (forward cho Cognito tự xử lý)
export const verifyOtp = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { username, code, session } = JSON.parse(event.body || "{}") as {
      username?: string;
      code?: string;
      session?: string;
    };
    if (!username || !code || !session) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone, OTP, and session are required" }),
      };
    }
    const normalizedPhone = `+${username}`;
    const command = new AdminRespondToAuthChallengeCommand({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
      ChallengeName: "CUSTOM_CHALLENGE",
      Session: session,
      ChallengeResponses: { USERNAME: normalizedPhone, ANSWER: code },
    });

    const response = await client.send(command);
    console.log("🚀 ~ verifyOtp ~ response:", response);

    if (response.AuthenticationResult) {
      return {
        statusCode: 200,
        body: JSON.stringify({ step: "REGISTER", session: session }),
      };
    } else if (response.ChallengeName === "CUSTOM_CHALLENGE") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid OTP, please try again",
          session: response.Session,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "OTP verification failed, unexpected response",
        }),
      };
    }
  } catch (error: any) {
    console.error("🚀 ~ verifyOtp ~ error:", error);
    if (error.name === "NotAuthorizedException") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid OTP, please try again",
          details: error.message,
        }),
      };
    } else if (error.name === "InvalidSessionException") {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Session expired or invalid, please restart login",
          details: error.message,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};

export const registerUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { username, password } = JSON.parse(event.body || "{}") as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone and password are required" }),
      };
    }

    // const normalizedPhone = phone.startsWith("+")
    //   ? phone
    //   : `+84${phone.replace(/^0/, "")}`;
    // console.log("🚀 ~ registerUser ~ received phone:", normalizedPhone);

    const normalizedPhone = `+${username}`;

    // Đặt password cho user trong Cognito
    await client.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: normalizedPhone,
        Password: password,
        Permanent: true,
      })
    );

    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          phone: normalizedPhone,
          registeredAt: new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ step: "PASSWORD", data: true, success: true }),
    };
  } catch (error: any) {
    console.error("🚀 ~ registerUser ~ error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Registration failed",
        details: error.message,
      }),
    };
  }
};

export const signin = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { username, password } = JSON.parse(event.body || "{}") as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username and password are required" }),
      };
    }

    // const normalizedPhone = phone.startsWith("+")
    //   ? phone
    //   : `+84${phone.replace(/^0/, "")}`;
    // console.log("🚀 ~ signin ~ received phone:", normalizedPhone);
    const normalizedPhone = `+${username}`;

    const command = new AdminInitiateAuthCommand({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: normalizedPhone,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);
    console.log("🚀 ~ signin ~ response:", response);

    if (response.AuthenticationResult) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          step: "SUCCESS",
          tokens: {
            accessToken: response.AuthenticationResult.AccessToken,
            idToken: response.AuthenticationResult.IdToken,
            refreshToken: response.AuthenticationResult.RefreshToken,
          },
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Authentication failed, unexpected response",
        }),
      };
    }
  } catch (error: any) {
    console.error("🚀 ~ signin ~ error:", error);
    if (error.name === "NotAuthorizedException") {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Invalid phone or password",
          details: error.message,
        }),
      };
    } else if (error.name === "UserNotFoundException") {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "User not found",
          details: error.message,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};

export default {
  startLogin,
  verifyOtp,
  registerUser,
  signin,
};
