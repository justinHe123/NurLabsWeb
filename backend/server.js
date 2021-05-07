// app.get('/', (req, res) => res.render('./test'))
const express = require('express')
const { Emails } = require("./tables.js")

const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

const cors = require('cors');
app.use(cors());
app.use(express.json()) // bodyParser is depreciated, use this instead :o

const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
const { verfiyRecaptcha } = require('./recaptcha.js')
const { nextTick } = require('process')
const readFile = promisify(fs.readFile);

// TODO: temporary email transport using mailtrap
let transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '03e042c4bb72af',
    pass: '8c44c93d49411e',
  }
})

const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const NURLABS_EMAIL = 'noreply@nurlabs.com';

const sendConfirmation = async (recipient) => {
  const message = {
    from: NURLABS_EMAIL, // Sender address
    to: recipient,         // List of recipients
    subject: 'Your feedback was submitted!', // Subject line
    html: await readFile('./templates/confirm.html', 'utf8'),
  };

  // send confirmation email
  transport.sendMail(message, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
}

app.post('/contact/submit', verfiyRecaptcha, (req, res) => {
    const { email, subject, text } = req.body;

    if (!re.test(email)) {
      res.sendStatus(400);
    } else {
      sendConfirmation(email);
      // TODO: send feedback email to nurlabs
      res.sendStatus(200);
    }
  });

// Temp place for submit email function
const submitEmail = (req, res) => {
  // TODO: check for a valid email
  if (re.test(req.body.email)) {
    Emails.create({ email: req.body.email })
    return res.sendStatus(201)
  } else {
    return res.sendStatus(400)
  }
}

// Email endpoint
app
  .post('/email/submit', verfiyRecaptcha, submitEmail);

// Filler endpoints
app.get('/', (req, res) => res.sendFile('test.html', { root: __dirname }))

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
