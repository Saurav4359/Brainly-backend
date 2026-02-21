import mongoose, { connect, model, Schema } from "mongoose";
import "dotenv/config";

 
connect(process.env.MONGO_URL!);

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

export const UserModel = model("Users", UserSchema);

const contentSchema = new Schema({
  title: {
    type: String,
  },
  link: {
    type: String,
  },
  type: {
    type: String,
  },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});
export const contentModel = model("Content", contentSchema);

const LinkSchema = new Schema({
  hash: {
    type: String,
  },
  link: {
    type: String,
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
    unique: true,
  },
});
export const LinkModel = model("Links", LinkSchema);
