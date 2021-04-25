import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

class TokenController {
  async postToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).populate([
        {
          path: "favorites",
        },
        {
          path: "recipies",
          options: { sort: { createdAt: -1 } },
        },
      ]);

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      if (!(await user.isPasswordValid(password))) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const { username, _id, recipies, favorites } = user;

      const token = user.getSignedToken();

      return res
        .status(201)
        .json({ username, email, _id, token, recipies, favorites });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later.",
      });
    }
  }
}

export default new TokenController();
