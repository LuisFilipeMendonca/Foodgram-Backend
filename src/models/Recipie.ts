import mongoose from "mongoose";

interface IRecipie extends mongoose.Document {
  photo: string;
  name: string;
  duration: number;
  servings: number;
  description: string;
  level: string;
  votes: number;
  votesCount: number;
  currentRating: number;
  ingredients: string[];
  steps: string[];
  user: mongoose.Schema.Types.ObjectId;
}

interface IRecipieModel extends mongoose.Model<any> {
  build(attr: IRecipie): any;
}

const recipieSchema = new mongoose.Schema<IRecipie, IRecipieModel>(
  {
    photo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    votesCount: {
      type: Number,
      default: 0,
    },
    currentRating: {
      type: Number,
      default: 0,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

recipieSchema.statics.build = (attr: IRecipie) => {
  return new Recipie(attr);
};

recipieSchema.virtual("photoUrl").get(function (this: IRecipie) {
  return `http://localhost:3001/images/${this.photo}`;
});

const Recipie = mongoose.model<IRecipie, IRecipieModel>(
  "Recipie",
  recipieSchema
);

export { Recipie };
