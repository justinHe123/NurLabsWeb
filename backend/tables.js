const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config()

// TODO: config
const sequelize = new Sequelize(
  `${process.env.DB}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        // Heroku requires us to use SSL. https://devcenter.heroku.com/changelog-items/2035
        require: true,
        // Unless we have an authorized SSL Cert to work with, we'll be rejected & get an error
        // Thus, we need to pass in rejectUnauthorized: false to work around this error
        rejectUnauthorized: false,
      },
    },
  }
);


const testConnection = async () => {
  console.log("start Authentication");
  await sequelize.authenticate();
  console.log("Successfully Connected");
};

testConnection()

const Emails = sequelize.define("Emails", {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  // verified: {
  //     type: DataTypes.BOOLEAN,
  //     defaultValue: false
  // }
});

Emails.sync()

module.exports = {
    Emails
}
