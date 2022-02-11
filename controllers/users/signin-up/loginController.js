const express = require("express");
var Db = require("./services");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser')
const verifyToken = require("./verifyToken");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser())

//////////////////////////  LOGIN    ////////////////////////////
/*  http://localhost:5000/user/login    
{
    "email": "ali123@gmail.com",
    "password": "123"
}   
*/

router.route("/login").post((request, response) => {
  let data = { ...request.body };
  if (!(data.email && data.password)) {
    response.status(400).json({ message: "All inputs are required" });
  } else {
    Db.getUserByEmail(data.email).then((user) => {
      if (user[0].length < 1) {
        return response.status(404).json({
          message: "User not found",
        });
      } else {
        bcrypt
          .compare(data.password, user[0][0].password)
          .then((match) => {
            if (match) {
              const accessToken = jwt.sign(
                {
                  email: user[0][0].email,
                  userId: user[0][0].userId,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "2h",
                }
              );
              response.cookie("access_token", accessToken, {
                httpOnly: true,
                maxAge: 2.592e+9,
                });
              response.status(200).json({
                message: "Login Successful",
                token: accessToken,
              });
            } else {
              response.status(401).json({
                message: "Incorrect Password",
              });
            }
          })
          .catch((err) => {
            response.status(500).json({
              error: err,
            });
          });
      }
    });
  }
});

////////////////////////// LOGOUT ///////////////////////////
//  http://localhost:5000/user/logout

router.route("/logout").get(verifyToken,(request, response) => {
    response.clearCookie("access_token");
    response.status(200).json({
        message: "Logout Successful",
    });
});

module.exports = router;
