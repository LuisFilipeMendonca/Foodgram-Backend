import { Request, Response } from "express";
import { Recipie } from "../models/Recipie";

class RecipieController {
  async postRecipie(req: Request, res: Response) {
    try {
      const recipie = Recipie.build(req.body);

      await recipie.save();

      return res.status(200).json(recipie);
    } catch (e) {
      console.log(e);
    }
  }

  async getRecipies(req: Request, res: Response) {
    try {
      const recipies = await Recipie.find();

      return res.status(200).json(recipies);
    } catch (e) {
      console.log(e);
    }
  }

  async getRecipie(req: Request, res: Response) {
    try {
      const recipie = await Recipie.findById(req.params.id);

      console.log(recipie);

      return res.status(200).json(recipie);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new RecipieController();
