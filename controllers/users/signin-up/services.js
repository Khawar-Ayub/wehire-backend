var config = require("../../../database/db.js");
const sql = require("mssql/msnodesqlv8");

async function addUser(user) {
  try {
    let pool = await sql.connect(config);
    let insertUser = await pool.query(
      "Insert into users(email,password) values('" +
        user.email +
        "','" +
        user.password +
        "')",
      (err, result) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("result", result);
        }
      }
    );
    return insertUser.recordsets;
  } catch (err) {
    console.log(err);
  }
}

async function getUserByEmail(email) {
  try {
    let pool = await sql.connect(config);
    let getUser = await pool
      .request()
      .query("SELECT * from users where email='" + email + "'");
    return getUser.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addUser: addUser,
  getUserByEmail: getUserByEmail,
};
