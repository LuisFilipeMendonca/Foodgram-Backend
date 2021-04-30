import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const loginRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(400).json({
        success: false,
        message: "You need to login into your account.",
      });
    }

    const [, token] = authorization.split(" ");

    const tokenSecret = process.env.TOKEN_SECRET || "secret";
    const userTokenData: any = jwt.verify(token, tokenSecret);

    const user = await User.findOne({ email: userTokenData.email }).populate([
      {
        path: "recipies",
        options: {
          sort: { createdAt: -1 },
          populate: { path: "user", select: "username" },
        },
      },
      {
        path: "favorites",
        options: { populate: { path: "user", select: "username" } },
      },
    ]);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Your session has expired." });
    }

    res.locals.user = user;

    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Your session has expired." });
  }
};

export default loginRequired;
