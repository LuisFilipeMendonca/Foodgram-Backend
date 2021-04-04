import mongoose from "mongoose";

interface IRecipie {
  name: string;
  duration: number;
  servings: number;
  description: string;
  level: string;
  votes: number;
  votesCount: number;
  ingredients: string[];
  steps: string[];
}

interface RecipieModelInterface extends mongoose.Model<any> {
  build(attr: IRecipie): any;
}

const recipieSchema = new mongoose.Schema(
  {
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
    votesQtt: {
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
  },
  { timestamps: true }
);

recipieSchema.statics.build = (attr: IRecipie) => {
  return new Recipie(attr);
};

const Recipie = mongoose.model<any, RecipieModelInterface>(
  "Recipie",
  recipieSchema
);

export { Recipie };
