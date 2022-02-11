var Db = require("./services");
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const verifyToken = require("../users/signin-up/verifyToken");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

//////////////////////////  LOGIN    ////////////////////////////
/*  http://localhost:5000/recruiter/login    
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
    Db.getRecruiterByEmail(data.email).then((recruiter) => {
      if (recruiter[0].length < 1) {
        return response.status(404).json({
          message: "Email not found",
        });
      } else {
        bcrypt
          .compare(data.password, recruiter[0][0].password)
          .then((match) => {
            if (match) {
              const Token = jwt.sign(
                {
                  email: recruiter[0][0].email,
                  recruiterId: recruiter[0][0].recruiterId,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "2h",
                }
              );
              response.cookie("token", Token, {
                httpOnly: true,
                maxAge: 2.592e9,
              });
              response.status(200).json({
                message: "Login Successful",
                token: Token,
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
//  http://localhost:5000/recruiter/logout

router.route("/logout").get(verifyToken, (request, response) => {
  response.clearCookie("token");
  response.status(200).json({
    message: "Logout Successful",
  });
});

router.route("/getRecruiter").get(verifyToken, (request, response) => {
  Db.getRecruiter()
    .then((data) => {
      response.status(200).json(data[0]);
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

///////////////////////////   REGISTER    ////////////////////////////
/*  http://localhost:5000/recruiter/register    
{
  "email": "ali123@gmail.com",
  "password":"123",
}
*/

router.route("/register").post((request, response) => {
  let data = { ...request.body };
  if (!(data.email && data.password)) {
    response.status(400).json({ message: "All inputs are required" });
  } else {
    Db.getRecruiterByEmail(data.email).then((recruiter) => {
      if (recruiter[0].length >= 1) {
        return response.status(409).json({
          message: "Email Already Exists",
        });
      } else {
        bcrypt.hash(data.password, 10, (err, hash) => {
          if (err) {
            return response.status(500).json({
              error: err,
            });
          } else {
            data.password = hash;
            Db.addRecruiter(data)
              .then((data) => {
                response.status(201).json({
                  message:
                    "Congratulations! Your account has been successfully created.",
                });
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
  }
});

module.exports = router;
