const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const secretKey = process.env.SECRET_KEY;
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const url = "mongodb://localhost:27017/peetcode";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  created_at: Date,
});

const userModel = mongoose.model("user", userSchema);

const queSchema = new mongoose.Schema({
  title: String,
  description: String,
  testCases: [],
  created_by: String,
  created_at: Date,
});
const questionModel = mongoose.model("questionModel", queSchema);

const submissionSchema = new mongoose.Schema({
  userId: String,
  questionId: String,
  solution: String,
  submitted_at: Date,
});

const submissionModel = mongoose.model("submissionModel", submissionSchema);
// const USERS = [];

// const QUESTIONS = [{
//     title: "Two states",
//     description: "Given an array , return the maximum of the array?",
//     testCases: [{
//         input: "[1,2,3,4,5]",
//         output: "5"
//     }]
// }];

// const SUBMISSION = [

// ]
const validationMiddleware = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next();
};
const checkUniqueFields = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    // Check if a user with the same username exists
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if a user with the same email exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If both username and email are unique, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const encryptionMiddleware = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

app.post(
  "/signup",
  validationMiddleware,
  checkUniqueFields,
  encryptionMiddleware,
  async function (req, res) {
    const { username, email, password } = req.body;
    const curTime = new Date();
    var newUser = new userModel({
      username,
      email,
      password,
      created_at: curTime,
    });
    try {
      const saveUser = await newUser.save();
      // Generate a JWT token
      const token = jwt.sign({ userId: saveUser._id }, secretKey);
      res.status(200).json({ message: "Signup successful", user: saveUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Signup failed" });
    }
  }
);

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password is not valid" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.cookie('token',token,{httpOnly:true});
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
  // Add logic to decode body
  // body should have email and password

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.send("Hello World from route 2!");
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
