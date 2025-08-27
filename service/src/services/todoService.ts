import {
  DeleteCommand,
  DeleteCommandInput,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import docClient from "../config/aws";
import { Todo } from "../types/todo";
import { generateUUID } from "../utils/helper";

const TableName = "todos-table";

export const createTodo = async (
  taskData: Omit<Todo, "id" | "createdAt" | "updatedAt">
): Promise<Todo> => {
  const id = generateUUID();
  const todo: Todo = {
    id,
    ...taskData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const params: PutCommandInput = { TableName, Item: todo };
  await docClient.send(new PutCommand(params));
  return todo;
};

export const listTodos = async (params: ScanCommandInput) => {
  const command = new ScanCommand(params);
  const result = await docClient.send(command);
  return result;
};

export const getTodo = async (id: string): Promise<Todo | undefined> => {
  const params: GetCommandInput = { TableName, Key: { id } };
  const command = new GetCommand(params);
  const result = await docClient.send(command);
  return result.Item as Todo | undefined;
};

export const updateTodo = async (
  id: string,
  taskData: Partial<Todo>
): Promise<Todo | undefined> => {
  const updateExpressions = [];
  const expressionAttributeValues: Record<string, any> = {
    ":u": new Date().toISOString(),
  };
  const expressionAttributeNames: Record<string, string> = {
    "#status": "status",
  };

  for (const key in taskData) {
    if (Object.prototype.hasOwnProperty.call(taskData, key)) {
      if (key === "status") {
        updateExpressions.push("#status = :s");
        expressionAttributeValues[":s"] = taskData.status;
      } else if(key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = taskData[key as keyof Todo];
      }
    }
  }

  const params: UpdateCommandInput = {
    TableName,
    Key: { id },
    UpdateExpression:
      "set " + updateExpressions.join(", ") + ", updatedAt = :u",
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };
  console.log("🚀 ~ updateTodo ~ params:", params)

  const command = new UpdateCommand(params);
  const result = await docClient.send(command);
  return result.Attributes as Todo | undefined;
};

export const deleteTodo = async (id: string): Promise<void> => {
  const params: DeleteCommandInput = { TableName, Key: { id } };
  const command = new DeleteCommand(params);
  await docClient.send(command);
};

export const listTodosByStatus = async (
  status: Todo["status"]
): Promise<Todo[]> => {
  const params: QueryCommandInput = {
    TableName,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": status },
  };
  const command = new QueryCommand(params);
  const result = await docClient.send(command);
  return (result.Items as Todo[]) || [];
};
