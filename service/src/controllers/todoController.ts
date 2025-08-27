import { ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as todoService from "../services/todoService";
import { Todo } from "../types/todo";

export const createTodo = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { taskCode, title, description, status } = JSON.parse(
      event.body || "{}"
    );
    const todo = await todoService.createTodo({
      taskCode,
      title,
      description,
      status,
    });
    return {
      statusCode: 201,
      body: JSON.stringify(todo),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not create todo.",
        error: error.message,
      }),
    };
  }
};

export const listTodos = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { keyword, status, limit, lastKey } =
      event.queryStringParameters || {};

    let scanParams: ScanCommandInput = {
      TableName: "todos-table",
      Limit: limit ? parseInt(limit as string) : 10,
    };

    if (lastKey) {
      scanParams.ExclusiveStartKey = JSON.parse(
        Buffer.from(lastKey as string, "base64").toString("ascii")
      );
    }

    let filterExpression = [];
    let expressionAttributeValues: Record<string, any> = {};
    if (status) {
      filterExpression.push("#status = :status");
      expressionAttributeValues[":status"] = status;
    }
    if (keyword) {
      filterExpression.push("contains(title, :keyword)");
      expressionAttributeValues[":keyword"] = keyword;
    }
    if (filterExpression.length > 0) {
      scanParams.FilterExpression = filterExpression.join(" and ");
      scanParams.ExpressionAttributeNames = { "#status": "status" };
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    const result = await todoService.listTodos(scanParams);

    let nextKey = null;
    if (result.LastEvaluatedKey) {
      nextKey = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
        "base64"
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: result.Items,
        count: result.Count,
        lastKey: nextKey,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not list todos.",
        error: error.message,
      }),
    };
  }
};

export const getTodo = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    const todo = await todoService.getTodo(id as string);
    if (!todo) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Todo not found." }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not get todo.",
        error: error.message,
      }),
    };
  }
};

export const updateTodo = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    const body = JSON.parse(event.body || "{}");
    const updatedTodo = await todoService.updateTodo(
      id as string,
      JSON.parse(event.body || "{}")
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updatedTodo),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not update todo.",
        error: error.message,
      }),
    };
  }
};

export const deleteTodo = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    await todoService.deleteTodo(id as string);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Todo deleted successfully." }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not delete todo.",
        error: error.message,
      }),
    };
  }
};

export const listTodosByStatus = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { status } = event.queryStringParameters || {};
    const todos = await todoService.listTodosByStatus(status as Todo["status"]);
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not list todos by status.",
        error: error.message,
      }),
    };
  }
};

export default {
  createTodo,
  listTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  listTodosByStatus,
};
