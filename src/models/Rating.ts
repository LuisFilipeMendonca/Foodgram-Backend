import mongoose from "mongoose";

interface IRating extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  value: number;
  recipie: mongoose.Schema.Types.ObjectId;
}

interface IRatingModel extends mongoose.Model<any> {
  build(attr: IRating): any;
}

const ratingSchema = new mongoose.Schema<IRating, IRatingModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    recipie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Recipie",
    },
  },
  { timestamps: true }
);

ratingSchema.statics.build = (attr: IRating) => {
  return new Rating(attr);
};

const Rating = mongoose.model<IRating, IRatingModel>("Rating", ratingSchema);

export { Rating };
