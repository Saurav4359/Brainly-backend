import express from "express";
import jwt from "jsonwebtoken";
import { signup } from "./validators/signup.js";
import { UserModel } from "./models/db.js";
const jwt_key="rwqegwerg54";
const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { data, success, error } = signup.safeParse(req.body);
  if (!success) {
    res.status(401).json({
      message: "Error",
      error: error,
    });
  }
  try {
  //@ts-ignore
  const user = await UserModel.create({
    username: data?.username,
    password: data?.password,
  });

  res.status(200).json({
    data: user,
    message: "Signup Done !",
  });
}
catch(e) {
    res.status(411).json({ 
        message : "User Already exists"
    })
}
});

app.post("/api/v1/signin", async (req, res) => {
  const { success, data, error } = signup.safeParse(req.body);
  if (!success) {
    res.status(401).json({
      message: "Invalid Input",
      error: error,
    });
  }
   
  try{ 
    //@ts-ignore
  const userexist=await UserModel.findOne({
     username :data?.username,
     password : data?.password
  })

if(userexist) {
    const token=jwt.sign({id : userexist._id},jwt_key);
    res.json({
        token
    })
}
else {
    res.status(411).json({
        message :"Invalid credentials"
    })
}
  }
  catch(e) { 
    res.send("Invalid entry");
  }
});

app.post("/api/v1/content", (req, res) => {});

app.get("/api/v1/content", (req, res) => {});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});


app.listen(3000);