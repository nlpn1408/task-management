// src/services/authService.ts
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import axios from "axios";

const poolData = {
  UserPoolId: "ap-southeast-1_4Fe9nw33I", // USER_POOL_ID
  ClientId: "4na95skm65bele9e295ej6q7u5", // CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

export const signUp = (
  username: string,
  password: string,
  email: string,
  extraAttributes?: { [key: string]: string }
) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    if (extraAttributes) {
      Object.entries(extraAttributes).forEach(([key, value]) => {
        attributeList.push(
          new CognitoUserAttribute({ Name: key, Value: value })
        );
      });
    }

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export function signIn(username: string, password: string) {
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const user = new CognitoUser({ Username: username, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const accessToken = session.getAccessToken().getJwtToken();
        resolve(accessToken);
      },
      onFailure: (err) => reject(err),
    });
  });
}

export function signInWithPhone(phone: string) {
  const endpoint = "http://localhost:3000"
  // const endpoint = "https://iji77mm5aa.execute-api.ap-southeast-1.amazonaws.com"

  return axios.post(`${endpoint}/auth/start-login`, {
    phone: phone,
  });
}

export const confirmSignUp = (username: string, code: string) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: username, Pool: userPool });
    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
