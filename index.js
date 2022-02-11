const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connectionDB = require("./database/db");
require('dotenv').config()
const port = process.env.PORT || 4000;
var cookieParser = require('cookie-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

//Controllers
const registerController = require("./controllers/users/signin-up/registerController");
const loginController = require("./controllers/users/signin-up/loginController");
const recruiterController = require("./controllers/recruiter/recruiterController");

//Routes
app.use("/user", registerController, loginController);
app.use("/recruiter", recruiterController);


app.listen(port, () => {
    console.log(`Server is running Fine on port ${port}`);
});
app.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send("Server is running Fine on port " + port);
});