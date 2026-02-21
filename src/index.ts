import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import { signup } from "./validators/signup.js";
import { contentModel, LinkModel, UserModel } from "./models/db.js";
import { userMiddleware } from "./middlewares/middlewares.js";
import { random } from "./utils/utils.js";
const jwt_key = "rwqegwerg54";
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT! || 4000;

app.get("/", (req, res) => {
  res.send("API is up and running!");
});
app.post("/api/v1/signup", async (req, res) => {
  const { data, success, error } = signup.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Error",
      error: error,
    });
  }

  try {
    const user = await UserModel.create({
      username: data.username,
      password: data.password,
    });

    res.status(200).json({
      data: user,
      message: "Signup Done !",
    });
  } catch (e) {
    res.status(411).json({
      message: "User Already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { success, data, error } = signup.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid Input",
      error: error,
    });
  }

  try {
    const userexist = await UserModel.findOne({
      username: data.username,
      password: data.password,
    });

    if (userexist) {
      const token = jwt.sign({ id: userexist._id }, jwt_key);
      res.json({
        token,
      });
    } else {
      res.status(411).json({
        message: "Invalid credentials",
      });
    }
  } catch (e) {
    res.send("Invalid entry");
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, title, type } = req.body;

  try {
    await contentModel.create({
      link,
      title,
      type,
      userId: new mongoose.Types.ObjectId(req.userId), // converts req.userId from string to object
      tags: [],
    });
    res.status(200).json({
      message: "Created",
    });
  } catch (e) {
    res.status(411).json("Invalid entry");
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await contentModel
    .find({
      userId: new mongoose.Types.ObjectId(req.userId),
    })
    .populate("userId", "username"); //(relationship) used to bring data from reference

  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;
  try {
    await contentModel.deleteMany({
      _id: contentId,
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    res.json({
      message: "Deleted",
    });
  } catch {
    return res.json("invalid data request");
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    const linkExist = await LinkModel.findOne({
      userId: new mongoose.Types.ObjectId(req.userId),
    });
    if (linkExist) {
      res
        .status(401)
        .json({ message: "Link already created", link: linkExist.hash });
      return;
    }
    const link = await LinkModel.create({
      userId: new mongoose.Types.ObjectId(req.userId),
      hash: random(10),
    });
    return res.status(200).send(link.hash);
  } else {
    await LinkModel.deleteMany({
      userId: new mongoose.Types.ObjectId(req.userId),
    });
    return res.json("Link deleted");
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({
    hash,
  });
  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }

  const content = await contentModel.find({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
    _id: link.userId,
  });
  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }
  res.json({
    username: user.username,
    content,
  });
});

app.listen(PORT);
