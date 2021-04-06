import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

class TokenController {
  async postToken(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!(await user.isPasswordValid(password))) {
        return res.status(400).json({ errorMsg: "Your password is incorrect" });
      }

      const tokenSecret = process.env.TOKEN_SECRET || "secret";
      const tokenExpiration = process.env.TOKEN_EXPIRATION || "1d";

      const token = jwt.sign({ email }, tokenSecret, {
        expiresIn: tokenExpiration,
      });

      const { _id, name } = user;

      return res.status(200).json({ _id, name, email, token });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new TokenController();
