import cors from "cors";
import "dotenv/config";
import express from "express";
import todoRoutes from "./routes/todoRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
