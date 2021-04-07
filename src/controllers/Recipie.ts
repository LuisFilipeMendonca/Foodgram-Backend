import { Request, Response } from "express";
import { Recipie } from "../models/Recipie";
import { User } from "../models/User";

class RecipieController {
  async postRecipie(req: Request, res: Response) {
    try {
      const data = {
        ...req.body,
        photo: req.file.filename,
        user: res.locals.userId._id,
      };

      const recipie = Recipie.build(data);
      const user = await User.findById(res.locals.userId._id);

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
      const { page, limit } = req.params;
      const skip = (+page - 1) * +limit;

      const recipies = await Recipie.find()
        .sort([["createdAt", -1]])
        .skip(skip)
        .limit(+limit)
        .populate("user", "name")
        .populate("ratings", {
          match: { user: res.locals.userId },
        });

      const count = await Recipie.countDocuments();

      return res.status(200).json({ recipies, count });
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
