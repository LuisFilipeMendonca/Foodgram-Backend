import { Request, Response } from "express";
import { Recipie } from "../models/Recipie";
import { User } from "../models/User";
import { Rating } from "../models/Rating";

class RecipieController {
  async postRecipie(req: Request, res: Response) {
    try {
      const recipie = Recipie.build(req.body);
      const user = await User.findById(req.body.user);

      user.recipies.push(recipie);

      await user.save();
      await recipie.save();

      return res.status(200).json(recipie);
    } catch (e) {
      console.log(e);
    }
  }

  async getRecipies(req: Request, res: Response) {
    try {
      const recipies = await Recipie.find()
        .populate("user", "name")
        .populate("ratings", {
          match: { user: res.locals.userId },
        });

      console.log(res.locals.userId);

      return res.status(200).json(recipies);
    } catch (e) {
      console.log(e);
    }
  }

  async getRecipie(req: Request, res: Response) {
    try {
      const recipie = await Recipie.findById(req.params.id);

      return res.status(200).json(recipie);
    } catch (e) {
      console.log(e);
    }
  }

  async updateRecipie(req: Request, res: Response) {
    try {
      const recipie = await Recipie.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body } },
        { new: true }
      );

      return res.status(200).json(recipie);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteRecipie(req: Request, res: Response) {
    try {
      const recipie = await Recipie.findByIdAndDelete(req.params.id);

      return res.status(200).json(recipie);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new RecipieController();
