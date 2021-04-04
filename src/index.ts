import express, { Application } from "express";
import mongoose from "mongoose";

import recipiesRouter from "./routes/recipies";

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
    this.app.use("/recipies", recipiesRouter);
  }
}

mongoose.connect(
  "mongodb+srv://luisMendonca:rapenghtler@cluster0.5x6bn.mongodb.net/foodgram?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to database")
);

export default new App().app;
