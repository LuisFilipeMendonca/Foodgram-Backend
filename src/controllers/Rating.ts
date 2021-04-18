import { Request, Response } from "express";
import { Rating } from "../models/Rating";
import { Recipie } from "../models/Recipie";

class RatingController {
  async postRating(req: Request, res: Response) {
    try {
      const { _id } = res.locals.user;
      const { value, recipie: recipieId } = req.body;

      const rating = new Rating({ user: _id, value, recipie: recipieId });
      const recipie = await Recipie.findById(recipieId);

      recipie.ratings.push(rating);
      recipie.votes += value;
      recipie.votesCount += 1;

      await recipie.save();
      await rating.save();

      return res.status(200).json({ rating });
    } catch (e) {
      console.log(e);
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

      await recipie.save();

      return res.status(200).json({ msg: "Rating deleted successfully" });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new RatingController();
