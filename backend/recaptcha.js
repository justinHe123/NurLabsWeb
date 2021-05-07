// verify at https://www.google.com/recaptcha/api/siteverify

const fetch = require('node-fetch');

// middleware for validating recaptcha
const verfiyRecaptcha = async (req, res, next) => {
    try {
        const url = 'https://www.google.com/recaptcha/api/siteverify'
        const secret = process.env.RECAPTCHA_SECRET_KEY
        const token = req.body.token
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
        }

        // query validation api
        const response = await fetch(`${url}?secret=${secret}&response=${token}`, options)
        const data = await response.json()
        if (data.success) {
            next();
        } else {
            return res.status(500).send("unverified recaptcha")
        }
    }
    catch (error) {
        console.log("error: " + error);
        return res.status(501).send("unverified recaptcha: " + error);
    }
}

module.exports = { verfiyRecaptcha };