const fetch = require("node-fetch")
// verify at https://www.google.com/recaptcha/api/siteverify

// middleware for validating recaptcha
const verfiyRecaptcha = async (req, res, next) => {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
    }
    // query validation api
    try {
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.token}`
        const response = await fetch(url, options)
        const data = await response.json()
        if (data.success) {
            console.log("recaptcha success")
            next(); // Comment if testing individually
            // return res.sendStatus(200)
        }
        else return res.status(401).send("unverified recaptcha")
    }
    catch (error) {
        return res.sendStatus(500)
    }
}

module.exports = verfiyRecaptcha;