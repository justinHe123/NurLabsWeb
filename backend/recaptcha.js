
// verify at https://www.google.com/recaptcha/api/siteverify

// middleware for validating recaptcha
const verfiyRecaptcha = async (req, res, next) => {
    const url = 'https://www.google.com/recaptcha/api/siteverify'
    const options = {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }),
        body: JSON.stringify({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            resonse: req.headers.token,
        })
    }
    // query validation api
    try {
        const response = await fetch(url, options)
        const data = await response.json()
        if (data.success) next();
        else return res.status(401).send("unverified recaptcha")
    }
    catch (error) {
        return res.status(401).send("unverified recaptcha")
    }
}

export default verfiyRecaptcha;