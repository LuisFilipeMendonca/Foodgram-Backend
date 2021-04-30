import { Request, Response } from "express";
import { Recipie } from "../models/Recipie";
import { User } from "../models/User";

const buildSortArr = (sortValue: string) => {
  let sort;

  if (sortValue === "recent") sort = ["createdAt", -1];
  if (sortValue === "old") sort = ["createdAt", 1];
  if (sortValue === "highStars") sort = ["currentRating", -1];
  if (sortValue === "lowStars") sort = ["currentRating", 1];

  return sort;
};

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

      return res.status(201).json({
        recipie,
        success: true,
        message: "Recipie added successfully",
      });
    } catch (e) {
      let message: string = "Something went wrong. Try again later";
      let data = [];
      let statusCode = 500;

      if (e.name === "ValidationError") {
        data = Object.values(e.errors).map((error: any) => error.message);
        statusCode = 422;
        message = "Invalid input values";
      }

      return res.status(statusCode).json({ success: false, message, data });
    }
  }

  async getRecipies(req: Request, res: Response) {
    try {
      const { page, limit, userId } = req.params;
      const skip = (+page - 1) * +limit;

      const { order } = req.query;

      let sort = buildSortArr(order?.toString() || "");

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
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later",
      });
    }
  }

  async getRecipie(req: Request, res: Response) {
    try {
      const recipie = await Recipie.findById(req.params.id);

      return res.status(200).json(recipie);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later",
      });
    }
  }

  async getRecipieByName(req: Request, res: Response) {
    try {
      const { recipieName, page, limit, userId } = req.params;
      const skip = (+page - 1) * +limit;

      const { order } = req.query;

      let sort = buildSortArr(order?.toString() || "");

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
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later",
      });
    }
  }

  async updateRecipie(req: Request, res: Response) {
    try {
      let data = { ...req.body };

      if (req.file && req.file.filename) {
        data = { ...data, photo: req.file.filename };
      }

      const recipie = await Recipie.findByIdAndUpdate(
        req.params.id,
        { $set: { ...data } },
        { new: true }
      );

      return res.status(200).json({
        recipie,
        success: true,
        message: "Recipie updated successfully",
      });
    } catch (e) {
      let message: string = "Something went wrong. Try again later";
      let data = [];
      let statusCode = 500;

      if (e.name === "ValidationError") {
        data = Object.values(e.errors).map((error: any) => error.message);
        statusCode = 422;
        message = "Invalid input values";
      }

      return res.status(statusCode).json({ success: false, message, data });
    }
  }

  async deleteRecipie(req: Request, res: Response) {
    try {
      await Recipie.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        id: req.params.id,
        success: true,
        message: "Recipie deleted successfully",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later.",
      });
    }
  }

  async postFavorite(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { user } = res.locals;

      user.favorites.push(id);
      await user.save();

      return res.status(201).json({
        success: true,
        message: "Recipie successfully added to favorites",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later.",
      });
    }
  }

  async deleteFavorites(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { user } = res.locals;

      user.favorites = user.favorites.filter(
        (favorite: any) => favorite.id !== id
      );

      await user.save();

      return res.status(201).json({
        success: true,
        message: "Recipie successfully remove from favorites",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later.",
      });
    }
  }
}

export default new RecipieController();
