import { Request, Response } from "express";
import { Recipie } from "../models/Recipie";
import { User } from "../models/User";

class RecipieController {
  async postRecipie(req: Request, res: Response) {
    try {
      const { _id } = res.locals.user;

      const data = {
        ...req.body,
        photo: req.file.filename,
        user: _id,
      };

      const recipie = Recipie.build(data);
      const user = await User.findById(_id);

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
      const { page, limit, userId } = req.params;
      const skip = (+page - 1) * +limit;

      const { order } = req.query;

      let sort;

      if (order === "recent") sort = ["createdAt", -1];
      if (order === "old") sort = ["createdAt", 1];
      if (order === "highStars") sort = ["stars", -1];
      if (order === "lowStars") sort = ["stars", 1];

      const recipies = await Recipie.find()
        .sort([sort])
        .skip(skip)
        .limit(+limit)
        .populate("user", "username")
        .populate({
          path: "ratings",
          match: { user: userId || null },
          select: "value",
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

  async getRecipieByName(req: Request, res: Response) {
    try {
      const { recipieName, page, limit, userId } = req.params;
      const skip = (+page - 1) * +limit;

      const { order } = req.query;

      let sort;

      if (order === "recent") sort = ["createdAt", -1];
      if (order === "old") sort = ["createdAt", 1];
      if (order === "highStars") sort = ["stars", -1];
      if (order === "lowStars") sort = ["stars", 1];

      const recipies = await Recipie.find({
        name: { $regex: recipieName, $options: "i" },
      })
        .sort([sort])
        .skip(skip)
        .limit(+limit)
        .populate({
          path: "ratings",
          match: { user: userId || null },
          select: "value",
        });

      const count = await Recipie.countDocuments({
        name: { $regex: recipieName, $options: "i" },
      });

      return res.status(200).json({ recipies, count });
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
