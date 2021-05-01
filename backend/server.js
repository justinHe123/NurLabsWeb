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

const nodemailer = require('nodemailer')
const fs = require('fs')

// TODO: boilerplate confirmation email
let transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '03e042c4bb72af',
    pass: '8c44c93d49411e'
  }
})

const message = {
  from: 'elonmusk@tesla.com', // Sender address
  to: 'test@test.com',         // List of recipients
  subject: 'Your feedback was submitted!', // Subject line
  html: '<h1>Thanks for the feedback!</h1>', 
};

const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

app.get('/contact/submit', 
  (req, res) => {
  // const sender = req.body.email;
  
  // send confirmation email
  transport.sendMail(message, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(data);
      res.sendStatus(200);
    }
  })
})

app.post('/email/submit',
        (req, res) => {
  // TODO: check for a valid email
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
