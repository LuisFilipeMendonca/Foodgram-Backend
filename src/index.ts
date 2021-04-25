import express, { Application, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { resolve } from "path";

import recipiesRoutes from "./routes/recipies";
import userRoutes from "./routes/users";
import tokenRoutes from "./routes/token";
import ratingsRoutes from "./routes/ratings";

dotenv.config();

class App {
  app: Application;
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.static(resolve(__dirname, "..", "uploads")));
  }

  private routes() {
    this.app.use("/recipies", recipiesRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/token", tokenRoutes);
    this.app.use("/ratings", ratingsRoutes);
  }
}

const uri = process.env.DB_URI || "";

mongoose.connect(
  uri,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log("connected to database")
);

export default new App().app;
