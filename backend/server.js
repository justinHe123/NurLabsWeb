// const express = require('express')

// // https://developers.google.com/recaptcha/docs/verify
// // https://www.google.com/recaptcha/api/siteverify

// const app = express();

// app.set('etag', false)

// app.get('/', (req, res) => res.render('./test'))
const express = require('express')
const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

// Setting up the body parser - will move if this should go elsewhere
const bodyParser = require('body-parser')
app.use(bodyParser.text())

app.post('/email/submit',
        (req, res) => {
  // TODO: check for a valid email
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  if(re.test(email)) {
    Emails.create({email: req.body.email})
    res.sendStatus(201)
  } else {
    res.sendStatus(400)
  }
})

// Filler endpoints
app
  .get('/', (req, res) => res.sendFile('test.html', {root: __dirname}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
