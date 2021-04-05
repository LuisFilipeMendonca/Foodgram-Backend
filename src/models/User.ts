import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<any> {
  build(attr: IUser): any;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recipies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipie" }],
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

userSchema.methods.isPasswordValid = async function (compPassword: string) {
  return await bcrypt.compare(compPassword, this.password);
};

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

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
