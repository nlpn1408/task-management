import express from "express";
import todoController from "../controllers/todoController";
const router = express.Router();

router.post("/", todoController.createTodo);
router.get("/", todoController.listTodos);
router.get("/:id", todoController.getTodo);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.get("/by-status/:status", todoController.listTodosByStatus);

export default router;