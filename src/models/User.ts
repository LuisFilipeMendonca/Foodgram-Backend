import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpiresIn: number;
}

interface IUserModel extends mongoose.Model<any> {
  build(attr: IUser): any;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  username: {
    type: String,
    required: [true, "Please provide a value to this field."],
  },
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a value to this field"],
    minLength: [6, "Your password must have at least 6 characters"],
  },
  recipies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipie" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipie" }],
  resetPasswordToken: String,
  resetPasswordExpiresIn: Date,
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

// Validates password field
userSchema.methods.isPasswordValid = async function (compPassword: string) {
  return await bcrypt.compare(compPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(25).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Returns user token
userSchema.methods.getSignedToken = function () {
  const tokenSecret = process.env.TOKEN_SECRET || "secret";
  const tokenExpiration = process.env.TOKEN_EXPIRATION || "1d";

  return jwt.sign({ email: this.email }, tokenSecret, {
    expiresIn: tokenExpiration,
  });
};

// Uses a pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);

    this.password = passwordHash;
    return next();
  } catch (e) {
    console.log(e);
  }
});

// Validates email field returning a Validation Error
// userSchema.path("email").validate(async (value: string) => {
//   const emailExists = await mongoose.models.User.countDocuments({
//     email: value,
//   });
//   return !emailExists;
// }, "Email already exists");

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
