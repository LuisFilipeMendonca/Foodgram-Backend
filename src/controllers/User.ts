import { Request, Response } from "express";
import { User } from "../models/User";

class UserController {
  async postUser(req: Request, res: Response) {
    try {
      const user = User.build(req.body);

      await user.save();

      return res.status(200).json(user);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new UserController();
