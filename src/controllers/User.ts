import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

class UserController {
  async postUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = User.build(req.body);

      await user.save();

      const { email, username, _id, recipies } = user;
      const token = user.getSignedToken();

      return res.status(201).json({ email, username, _id, token, recipies });
    } catch (e) {
      let message: string = "Something went wrong. Try again later";
      let data = [];
      let statusCode = 500;

      if (e.name === "ValidationError") {
        data = Object.values(e.errors).map((error: any) => error.message);
        statusCode = 422;
        message = "Invalid input values";
      }

      return res.status(statusCode).json({ success: false, message, data });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { _id, email, username, recipies, favorites } = res.locals.user;

      return res
        .status(200)
        .json({ _id, email, username, recipies, favorites });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later",
      });
    }
  }

  async forgottenPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
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

        return res.status(201).json({ message: "Email Sent", success: true });
      } catch (e) {
        user.resetPasswordExpiresIn = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
        return res.status(400).json({
          success: false,
          message: "Verification email not sent. Try again later.",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Try again later",
      });
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

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Token have expired" });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresIn = undefined;

      await user.save();

      return res.status(201).json(user);
    } catch (e) {
      let message: string = "Something went wrong. Try again later";
      let data = [];
      let statusCode = 500;

      if (e.name === "ValidationError") {
        data = Object.values(e.errors).map((error: any) => error.message);
        statusCode = 422;
        message = "Invalid input values";
      }

      return res.status(statusCode).json({ success: false, message, data });
    }
  }
}

export default new UserController();
