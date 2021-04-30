import { Request, Response } from "express";
import { Rating } from "../models/Rating";
import { Recipie } from "../models/Recipie";

class RatingController {
  async postRating(req: Request, res: Response) {
    try {
      const { _id } = res.locals.user;
      const { value, recipieId } = req.body;

      const rating = new Rating({ user: _id, value, recipie: recipieId });
      const recipie = await Recipie.findById(recipieId);

      recipie.ratings.push(rating);
      recipie.votes += value;
      recipie.votesCount += 1;
      recipie.currentRating = recipie.votes / recipie.votesCount;

      await recipie.save();
      await rating.save();

      return res.status(201).json({ _id: rating._id });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later.",
      });
    }
  }

  async deleteRating(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rating = await Rating.findByIdAndDelete(id);
      const recipie = await Recipie.findById(rating.recipie);

      recipie.ratings.pull({ _id: id });
      recipie.votes -= rating.value;
      recipie.votesCount -= 1;
      recipie.currentRating = recipie.votes / recipie.votesCount;

      await recipie.save();

      return res
        .status(200)
        .json({
          success: true,
          msg: "Rating deleted successfully",
          votes: recipie.votes,
          votesCount: recipie.votesCount,
        });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later.",
      });
    }
  }
}

export default new RatingController();
