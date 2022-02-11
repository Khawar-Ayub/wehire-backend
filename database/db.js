const sql = require('mssql/msnodesqlv8');

//Database Configruation
const config = {
    server: 'DESKTOP-KIGFLUE\\SQLEXPRESS',
    database: 'jobPortal',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        enableArithAbort:  true,
    },
};

sql.connect(config).then(() => {
    console.log("Database Connected");
}).catch((err) => {
    console.log("Error while connecting database :- " + err);
});

module.exports = config;