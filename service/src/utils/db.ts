import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || "Users";

export async function checkUserInDB(phone: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { phone },
    })
  );

  return !!result.Item;
}

export async function createUserInDB(user: {
  phone: string;
  name?: string;
  address?: string;
}) {
  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    })
  );
}
