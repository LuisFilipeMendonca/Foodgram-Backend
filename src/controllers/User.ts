import { Request, Response } from "express";
import { User } from "../models/User";

class UserController {
  async postUser(req: Request, res: Response) {
    try {
      const user = User.build(req.body);

      await user.save();

      const { email, username, _id } = user;
      const token = user.getSignedToken();

      return res.status(200).json({ email, username, _id, token });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new UserController();
