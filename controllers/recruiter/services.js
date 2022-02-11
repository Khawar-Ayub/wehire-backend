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
async function addRecruiter(recruiter) {
  try {
    let pool = await sql.connect(config);
    let insertRecruiter = await pool
      .query("Insert into recruiter(email,password,companyName,companyFounded) values('" + recruiter.email + "','" + recruiter.password + "','" + recruiter.companyName + "','" + recruiter.companyFounded + "')");
    return insertRecruiter.recordsets;
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  getRecruiter: getRecruiter,
  addRecruiter: addRecruiter,
};
