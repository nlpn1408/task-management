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

// src/controllers/todoController.ts
var todoController_exports = {};
__export(todoController_exports, {
  createTodo: () => createTodo2,
  default: () => todoController_default,
  deleteTodo: () => deleteTodo2,
  getTodo: () => getTodo2,
  listTodos: () => listTodos2,
  listTodosByStatus: () => listTodosByStatus2,
  updateTodo: () => updateTodo2
});
module.exports = __toCommonJS(todoController_exports);

// src/services/todoService.ts
var import_lib_dynamodb2 = require("@aws-sdk/lib-dynamodb");

// src/config/aws.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var client = new import_client_dynamodb.DynamoDBClient({
  region: process.env.AWS_REGION
});
var docClient = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
var aws_default = docClient;

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/utils/helper.ts
var generateUUID = () => v4_default();

// src/services/todoService.ts
var TableName = "todos-table";
var createTodo = async (taskData) => {
  const id = generateUUID();
  const todo = {
    id,
    ...taskData,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const params = { TableName, Item: todo };
  await aws_default.send(new import_lib_dynamodb2.PutCommand(params));
  return todo;
};
var listTodos = async (params) => {
  const command = new import_lib_dynamodb2.ScanCommand(params);
  const result = await aws_default.send(command);
  return result;
};
var getTodo = async (id) => {
  const params = { TableName, Key: { id } };
  const command = new import_lib_dynamodb2.GetCommand(params);
  const result = await aws_default.send(command);
  return result.Item;
};
var updateTodo = async (id, taskData) => {
  const updateExpressions = [];
  const expressionAttributeValues = {
    ":u": (/* @__PURE__ */ new Date()).toISOString()
  };
  const expressionAttributeNames = {
    "#status": "status"
  };
  for (const key in taskData) {
    if (Object.prototype.hasOwnProperty.call(taskData, key)) {
      if (key === "status") {
        updateExpressions.push("#status = :s");
        expressionAttributeValues[":s"] = taskData.status;
      } else if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = taskData[key];
      }
    }
  }
  const params = {
    TableName,
    Key: { id },
    UpdateExpression: "set " + updateExpressions.join(", ") + ", updatedAt = :u",
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  console.log("\u{1F680} ~ updateTodo ~ params:", params);
  const command = new import_lib_dynamodb2.UpdateCommand(params);
  const result = await aws_default.send(command);
  return result.Attributes;
};
var deleteTodo = async (id) => {
  const params = { TableName, Key: { id } };
  const command = new import_lib_dynamodb2.DeleteCommand(params);
  await aws_default.send(command);
};
var listTodosByStatus = async (status) => {
  const params = {
    TableName,
    IndexName: "status-index",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": status }
  };
  const command = new import_lib_dynamodb2.QueryCommand(params);
  const result = await aws_default.send(command);
  return result.Items || [];
};

// src/controllers/todoController.ts
var createTodo2 = async (event) => {
  try {
    const { taskCode, title, description, status } = JSON.parse(
      event.body || "{}"
    );
    const todo = await createTodo({
      taskCode,
      title,
      description,
      status
    });
    return {
      statusCode: 201,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not create todo.",
        error: error.message
      })
    };
  }
};
var listTodos2 = async (event) => {
  try {
    const { keyword, status, limit, lastKey } = event.queryStringParameters || {};
    let scanParams = {
      TableName: "todos-table",
      Limit: limit ? parseInt(limit) : 10
    };
    if (lastKey) {
      scanParams.ExclusiveStartKey = JSON.parse(
        Buffer.from(lastKey, "base64").toString("ascii")
      );
    }
    let filterExpression = [];
    let expressionAttributeValues = {};
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
    const result = await listTodos(scanParams);
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
        lastKey: nextKey
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not list todos.",
        error: error.message
      })
    };
  }
};
var getTodo2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const todo = await getTodo(id);
    if (!todo) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Todo not found." })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not get todo.",
        error: error.message
      })
    };
  }
};
var updateTodo2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const body = JSON.parse(event.body || "{}");
    const updatedTodo = await updateTodo(
      id,
      JSON.parse(event.body || "{}")
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updatedTodo)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not update todo.",
        error: error.message
      })
    };
  }
};
var deleteTodo2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    await deleteTodo(id);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Todo deleted successfully." })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not delete todo.",
        error: error.message
      })
    };
  }
};
var listTodosByStatus2 = async (event) => {
  try {
    const { status } = event.queryStringParameters || {};
    const todos = await listTodosByStatus(status);
    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not list todos by status.",
        error: error.message
      })
    };
  }
};
var todoController_default = {
  createTodo: createTodo2,
  listTodos: listTodos2,
  getTodo: getTodo2,
  updateTodo: updateTodo2,
  deleteTodo: deleteTodo2,
  listTodosByStatus: listTodosByStatus2
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTodo,
  deleteTodo,
  getTodo,
  listTodos,
  listTodosByStatus,
  updateTodo
});
//# sourceMappingURL=todoController.js.map
