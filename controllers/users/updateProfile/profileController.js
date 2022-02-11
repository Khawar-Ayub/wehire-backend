const express = require("express");
var Db = require("../signin-up/services");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//////////////////// UPDATE PROFILE //////////////////////
/*  http://localhost:5000/user/1
{
    "email": "ali12563@gmail.com",
    "password": "moiz1",
    "confirmPassword": "moiz1"
}  
*/
router.route("/:id").put((request, response) => {
  let data = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    userId: request.params.id,
  };
  if (!(data.email && data.password && data.confirmPassword)) {
    response.status(400).json({ message: "All inputs are required" });
  } else if (data.password !== data.confirmPassword) {
    response
      .status(400)
      .json({ message: "Password and Confirm Password do not match" });
  } else {
    Db.getUserByEmail(data.email).then((user) => {
      if (user[0].length >= 1) {
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
            Db.editUser(data)
              .then((data) => {
                response.clearCookie("access_token");
                response.status(201).json({
                  message: "User Updated successfully",
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
