import { Request, Response } from "express";
import { User } from "../models/User";

class TokenController {
  async postToken(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!(await user.isPasswordValid(password))) {
        return res.status(400).json({ errorMsg: "Your password is incorrect" });
      }

      const { username, _id } = user;

      const token = user.getSignedToken();

      return res.status(200).json({ username, email, _id, token });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new TokenController();
