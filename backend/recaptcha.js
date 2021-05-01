
// verify at https://www.google.com/recaptcha/api/siteverify

// middleware for validating recaptcha
const verfiyRecaptcha = (req, res, next) => {
    const url = 'https://www.google.com/recaptcha/api/siteverify'
    const options = {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }),
        body: JSON.stringify({
            secret: process.env.SECRET,
            resonse: req.headers.token,
        })
    }
    // query validation api
    fetch(url, options)
        .then(res => res.json())
        .then(res => {
            // go next if success, otherwise end the request
            if (res.success) {
                next()
            }
            else return res.status(500).send("unverified recaptcha");
        })
        .catch(err => {
            return res.status(500).send("unverified recaptcha");
        })

}

export default verfiyRecaptcha;