require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: "tu_password_aqui",
    database: "hospital_devices",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    logging: false,
  },

  production: {
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      charset: "utf8mb4",
    },
  }
};
