import { Request, Response } from "express";
import { User } from "../models/User";
import sendEmail from "../utils/sendEmail";
import sgMail from "@sendgrid/mail";

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

      const { resetPasswordToken, resetPasswordExpiresIn } = user;

      await User.updateOne(
        { email },
        { resetPasswordToken, resetPasswordExpiresIn }
      );

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

        return res.status(201).json({ message: "Email Sent" });
      } catch (e) {
        await User.updateOne(
          { email },
          { resetPasswordToken: undefined, resetPasswordExpiresIn: undefined }
        );
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default new UserController();
