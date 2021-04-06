import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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
  },
  () => console.log("connected to database")
);

export default new App().app;
