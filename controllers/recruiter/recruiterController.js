var Db = require("./services");
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
const verifyToken = require("../users/signin-up/verifyToken");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.route("/getRecruiter").get(verifyToken,(request, response) => {
  Db.getRecruiter().then((data) => {
    response.status(200).json(data[0]);
  }).catch((err) => {
    response.status(500).json(err);
  });
});

router.route('/addRecruiter').post((request, response) => {
  let data = { ...request.body }
  Db.addRecruiter(data).then(data  => {
    response.status(201).json({message: "Recruiter added successfully"});
  }).catch(err => {
    response.status(500).json({error: err});
  });
})

module.exports = router;