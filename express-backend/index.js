const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

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
  isAdmin: Boolean,
  created_at: Date,
});

const userModel = mongoose.model("user", userSchema);

const queSchema = new mongoose.Schema({
  title: String,
  description: String,
  testCases: [],
  created_by: String,
  solution: String,
  created_at: Date,
});
const questionModel = mongoose.model("questionModel", queSchema);

const submissionSchema = new mongoose.Schema({
  submitted_by: String,
  questionId: String,
  solution: String,
  submitted_at: Date,
});

const submissionModel = mongoose.model("submissionModel", submissionSchema);

// const QUESTIONS = [{
//     title: "Two states",
//     description: "Given an array , return the maximum of the array?",
//     testCases: [{
//         input: "[1,2,3,4,5]",
//         output: "5"
//     }]
// }];

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
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ success: false, error: "Username and password are required" });
    }
    const curTime = new Date();
    var newUser = new userModel({
      username,
      email,
      password,
      created_at: curTime,
      isAdmin: false,
    });
    try {
      const saveUser = await newUser.save();
      // Generate a JWT token
      console.log(secretKey);
      const token = jwt.sign({ userId: saveUser._id }, secretKey, {
        expiresIn: "2d",
      });
      res
        .status(200)
        .json({ success: true, message: "Signup successful", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Signup Failed" });
    }
  }
);

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Username and password are required" });
  }
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Password is not valid" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "2d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token was provided" });
  }

  jwt.verify(token, secretKey, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.token = decodedToken;

    next();
  });
};
const checkAdmin = async (req, res, next) => {
  const token = req.token;
  const userId = token["userId"];
  console.log(userId);
  const user = await userModel.findById(userId);
  const isAdmin = user["isAdmin"];
  if (!isAdmin) {
    return res
      .status(401)
      .json({ success: false, error: "User is not authorized to be admin" });
  }
  next();
};
app.post(
  "/postQuestion",
  authenticateToken,
  checkAdmin,
  async function (req, res) {
    const { title, description, testCases } = req.body;
    if (!title || !description || !testCases) {
      return res
        .status(400)
        .json({
          success: false,
          error: "title, description and testcases are required",
        });
    }
    const userId = req.token.userId;
    const curTime = new Date();
    const user = await userModel.findById(userId);
    const username = user["username"];
    
    var newQuestion = new questionModel({
      title: title,
      description: description,
      testCases: testCases,
      created_by: username,
      solution: "",
      created_at: curTime,
    });

    try {
      await newQuestion.save();
      //To-Do Submit a solution with the question and question should be added to database only after
      res
        .status(200)
        .json({ success: true, message: "Question posted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Question not posted!!!" });
    }
  }
);

app.get("/questions",authenticateToken, async function (req, res) {
  try{
    const questions = await questionModel.find();
    res.status(200).json({success:true,questions});
  }
  catch(error){
    res.status(500).json({ success: false, error: "Internal server error!!!" });
  }
});
app.post("/submissions", function(req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
 res.send("Hello World from route 4!")
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
});



app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
