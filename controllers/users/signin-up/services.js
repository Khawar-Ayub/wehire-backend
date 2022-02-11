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

async function getUserById(id) {
  try {
    let pool = await sql.connect(config);
    let getUser = await pool
      .request()
      .query("SELECT * from users where userId='" + id + "'");
    return getUser.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function editUser(user) {
  try {
    let pool = await sql.connect(config);
    let editUser = await pool.query(
      "UPDATE users SET email='" +
        user.email +
        "',password='" +
        user.password +
        "' where userId=" +
        user.userId,
      (err, result) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("result", result);
        }
      }
    );
    return editUser.recordsets;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  addUser: addUser,
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  editUser: editUser,
};
