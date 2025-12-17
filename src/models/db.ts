import {connect, model, Schema } from "mongoose";

connect("mongodb+srv://Saurav:cARYaRX7uHzgE2Hw@cluster0.gxeqafm.mongodb.net/Brainly");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

export  const UserModel = model("Users",UserSchema);
