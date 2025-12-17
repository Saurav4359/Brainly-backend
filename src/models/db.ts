import mongoose, { connect, model, Schema } from "mongoose";
 

connect(
  "mongodb+srv://Saurav:cARYaRX7uHzgE2Hw@cluster0.gxeqafm.mongodb.net/Brainly"
);

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
  link :{
    type: String
  },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId:  {
    type :mongoose.Types.ObjectId,
    ref :"Users",
    required: true
  }
});
  export const contentModel=model("Content",contentSchema);
 
