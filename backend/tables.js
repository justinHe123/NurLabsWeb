const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config()

let dburl;
if (process.env.DATABASE_URL) dburl = process.env.DATABASE_URL;
else dburl = `${process.env.DB}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;


const sequelize = new Sequelize(
  dburl,
  {
    dialect: 'postgres',
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
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
  }},
  {
    indexes: [{
      unique: true,
      fields: ['email']
    }]
  }
);

Emails.sync()

module.exports = {
    Emails
}
