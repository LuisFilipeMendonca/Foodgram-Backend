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
      return res.status(400).json({ errorMsg: "Your session has expired." });
    }

    const [, token] = authorization.split(" ");

    const tokenSecret = process.env.TOKEN_SECRET || "secret";
    const userTokenData: any = jwt.verify(token, tokenSecret);

    const user = await User.findOne({ email: userTokenData.email }).select(
      "_id"
    );

    if (!user) {
      return res.status(400).json({ errorMsg: "Your session has expired" });
    }

    res.locals.userId = user;

    next();
  } catch (e) {
    console.log(e);
  }
};

export default loginRequired;
