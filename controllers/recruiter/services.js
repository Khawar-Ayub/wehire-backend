var config = require("../../database/db.js");
const sql = require("mssql/msnodesqlv8");

async function getRecruiter() {
  try {
    let pool = await sql.connect(config);
    let recruiterData = await pool.request().query("SELECT * from recruiter");
    return recruiterData.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getRecruiterByEmail(email) {
  try {
    let pool = await sql.connect(config);
    let getRecruiter = await pool
      .request()
      .query("SELECT * from recruiter where email='" + email + "'");
    return getRecruiter.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function addRecruiter(recruiter) {
  try {
    let pool = await sql.connect(config);
    let insertRecruiter = await pool
      .query("Insert into recruiter(email,password) values('" + recruiter.email + "','" + recruiter.password + "')");
    return insertRecruiter.recordsets;
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  getRecruiter: getRecruiter,
  getRecruiterByEmail: getRecruiterByEmail,
  addRecruiter: addRecruiter,
};
