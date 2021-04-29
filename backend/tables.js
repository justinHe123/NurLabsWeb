const { Sequelize, DataTypes } = require('sequelize')

// TODO: config
const sql = new Sequelize()

const Emails = sequelize.define('emails', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    // verified: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false
    // }
})

