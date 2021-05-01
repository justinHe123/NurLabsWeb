// app.get('/', (req, res) => res.render('./test'))
const express = require('express')
const { Emails } = require("./tables.js")

const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

// Setting up the body parser - will move if this should go elsewhere
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())

// Email endpoint
app
  .post('/email/submit', submitEmail)

// Temp place for submit email function
const submitEmail = (req, res) => {
  // TODO: check for a valid email
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  if(re.test(email)) {
    Emails.create({email: req.body.email})
    return res.sendStatus(201)
  } else {
    return res.sendStatus(400)
  }
}

// Filler endpoints
app.get('/', (req, res) => res.sendFile('test.html', {root: __dirname}))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
