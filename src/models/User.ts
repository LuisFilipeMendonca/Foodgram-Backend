import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
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
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

userSchema.methods.isPasswordValid = async function (compPassword: string) {
  return await bcrypt.compare(compPassword, this.password);
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
userSchema.path("email").validate(async (value: string) => {
  const emailExists = await mongoose.models.User.countDocuments({
    email: value,
  });
  return !emailExists;
}, "Email already exists");

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
