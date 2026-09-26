import express, { json } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import productsRouter from "./routes/productsRouter.js";
import orderRouter from "./routes/orderRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/orders", orderRouter);

app.use("/admin/orders", adminOrderRoutes);

app.get("/", (req, res) => {
  res.json("You server is active");
});

export default app;