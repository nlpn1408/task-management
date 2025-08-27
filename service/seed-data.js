const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({
  region: "ap-southeast-1",
});
const docClient = DynamoDBDocumentClient.from(client);

const seedData = [
  {
    id: uuidv4(),
    taskCode: "TASK001",
    title: "Design New Homepage Mockup",
    description:
      "Create three different mockup designs for the new homepage. Focus on modern UI/UX principles and mobile responsiveness.",
    status: "Todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK002",
    title: "Develop User Authentication",
    description:
      "Implement user authentication with JWT tokens and social login.",
    status: "In Progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK003",
    title: "Write API Documentation",
    description:
      "Document all the endpoints, request/response formats, and examples for the task management API.",
    status: "Done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK004",
    title: "Implement Caching Layer",
    description:
      "Add a caching layer (e.g., Redis) to improve API performance and reduce database load.",
    status: "Todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK005",
    title: "Fix Critical Bugs",
    description:
      "Resolve all high-priority bugs reported by the QA team for the latest release.",
    status: "Done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK006",
    title: "Setup CI/CD Pipeline",
    description:
      "Configure a CI/CD pipeline using GitHub Actions to automate deployment.",
    status: "In Progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK007",
    title: "Code Review - Sprint 2",
    description:
      "Review pull requests from the development team for the current sprint's tasks.",
    status: "Todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK008",
    title: "Database Schema Migration",
    description:
      "Perform necessary database schema migrations for new features.",
    status: "Done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK009",
    title: "Client Meeting Preparation",
    description:
      "Prepare presentation slides and talking points for the weekly client meeting.",
    status: "In Progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    taskCode: "TASK010",
    title: "Write Unit Tests",
    description:
      "Write comprehensive unit tests for the core logic of the new features.",
    status: "Todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const run = async () => {
  try {
    // Bước 1: Xóa tất cả dữ liệu cũ
    console.log("Deleting existing data...");
    const scanCommand = new ScanCommand({ TableName: "todos-table" });
    const { Items } = await docClient.send(scanCommand);

    if (Items && Items.length > 0) {
      const deleteRequests = Items.map((item) => ({
        DeleteRequest: {
          Key: { id: item.id },
        },
      }));

      const batchDeleteCommand = new BatchWriteCommand({
        RequestItems: { "todos-table": deleteRequests },
      });
      await docClient.send(batchDeleteCommand);
    }
    console.log("Existing data deleted successfully!");

    // Bước 2: Thêm dữ liệu mẫu mới
    console.log("Creating new seed data...");
    const putRequests = seedData.map((item) => ({
      PutRequest: {
        Item: item,
      },
    }));

    const batchPutCommand = new BatchWriteCommand({
      RequestItems: { "todos-table": putRequests },
    });
    await docClient.send(batchPutCommand);

    console.log("New seed data created successfully!");
  } catch (err) {
    console.error("Error running seed script:", err);
  }
};

run();
