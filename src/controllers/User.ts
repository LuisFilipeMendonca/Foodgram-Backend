import { Request, Response } from "express";
import { User } from "../models/User";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

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

  async forgottenPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ errorMsg: "Invalid credentials" });
      }

      const resetToken = user.getResetToken();

      await user.save();

      const resetUrl = `http://localhost:3000/password_reset/${resetToken}`;

      const message = `
        <h1>FoodGram</h1>
        <h2>You have requested a password reset</h2>
        <p>Please to go this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

      try {
        await sendEmail({
          to: user.email,
          subject: "Password Reset Request",
          text: message,
        });

        return res.status(201).json({ message: "Email Sent", resetToken });
      } catch (e) {
        user.resetPasswordExpiresIn = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const resetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpiresIn: { $gt: Date.now() },
      });

      user.password = password;

      await user.save();

      return res.status(201).json(user);
    } catch (e) {}
  }
}

export default new UserController();
