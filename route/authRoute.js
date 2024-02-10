const express=require("express");
const authRoute=express.Router();
// const tokenRoute=express.Router();
require("dotenv").config();
const cookieParser=require("cookie-parser")
const {UserModel}=require("../model/userModel");
const {authValidator}=require("../middleware/authValidator.js")
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")
const {blacklist}=require("../blacklist")
const { TokenModel}=require("../model/tokenModel.js")

authRoute.post("/register", async (req, res) => {
  try {
      const { name, email, pass, city, age } = req.body;

      // Check password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(pass)) {
          return res.status(400).send({ error: "Password does not meet requirements" });
      }

      const isUserPresent = await UserModel.findOne({ email });
      if (isUserPresent) {
          return res.status(400).send({ error: `User with Email ${email} already exists` });
      }

      bcrypt.hash(pass, 10, async function(err, hash) {
          if (err) {
              console.error(err);
              return res.status(500).send({ error: "Error hashing password" });
          }
          const newUser = new UserModel({ name, email, pass: hash, city, age });
          await newUser.save();
          return res.status(200).send({ message: `${name} Registered Successfully` });
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
  }
});


authRoute.post("/login", authValidator, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const accessToken = jwt.sign(
        { userId: user._id, user: user.username },
        "k",
        { expiresIn: 600 }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, user: user.username },
        "rk",
        { expiresIn: 1200 }
      );

      console.log(`accessToken:${accessToken}, refreshToken:${refreshToken}`);

      res.cookie("access-Token", accessToken);
      res.cookie("refresh-Token", refreshToken);

      res.status(200).send({ message:`${user.username} Logged in successfully`,accessToken, refreshToken });
      console.log("Logged in");
    } else {
      console.log("Wrong credentials");
      res.status(401).send({ error: "Wrong credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
  


  authRoute.get("/logout", async (req, res) => {
    try {
        const cookies = req.cookies;
        const accessToken = cookies["access-Token"];

        if (!accessToken) {
            return res.status(401).send({ "message": "Invalid token" });
        }

        
        const newToken = new TokenModel({ token: accessToken });
        await newToken.save();
        console.log("token saved to DB")


        res.clearCookie('access-Token');
        res.status(200).send({ "message": "User logout successful" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ "error": "Internal server error" });
    }
});

// authRoute.post("/refresh", async (req, res) => {
//   const refreshToken = req.refreshToken;

//   jwt.verify(refreshToken, "rk", async function (err, decoded) {
//     if (err) {
//       console.error("Error verifying refreshToken:", err);
//       res.status(401).send("Login again");
//     } else {
//       const newAccessToken = jwt.sign(
//         { userId: decoded.userId, user: decoded.user },
//         "k",
//         { expiresIn: 600 }
//       );
//       res.cookie("access-Token", newAccessToken, {
//         maxAge: 1000 * 700,
//       });
//       console.log("Refresh token in work");
//       req.accessToken = newAccessToken;
//       req.body.userId = decoded.userId;
//       req.body.user = decoded.user;
//       res.status(200).send({ accessToken: newAccessToken });
//     }
//   });
// });

module.exports={authRoute}