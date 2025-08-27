import { CognitoJwtVerifier } from "aws-jwt-verify";
import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";

const cognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.CLIENT_ID!,
});

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  try {
    // Get token from headers
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Cognito
    const verified = await cognitoJwtVerifier.verify(token);

    return {
      isAuthorized: true,
      context: {
        email: (verified as any).email || "",
        username: (verified as any)["cognito:username"] || "",
        sub: verified.sub,
      },
    };
  } catch (error: any) {
    console.error("🚀 ~ Auth Error:", error.message);
    throw new Error("Unauthorized");
  }
};

export default {
  handler,
};
