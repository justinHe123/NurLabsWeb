//////////////// SETUP ////////////////

const express = require('express')
const cors = require('cors');
const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
const { Emails } = require("./tables.js")
const verifyRecaptcha = require("./recaptcha.js")

const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json()) // bodyParser is depreciated, use this instead :o

const readFile = promisify(fs.readFile);

//////////////// ENDPOINT FUNCTIONS ////////////////

const submitContact = (req, res) => {
  try {
    console.log(req.body);
    const { email, subject, text} = req.body;

    if (validEmail(email)) {
      sendConfirmation(email);
      // TODO: send feedback email to nurlabs
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  }
  catch (error) {
    return res.sendStatus(500)
  }
}

const submitEmail = async (req, res) => {
  try {
    if(validEmail(req.body.email)) {
      await Emails.create({email: req.body.email})
      return res.sendStatus(201)
    } else {
      return res.sendStatus(400)
    }
  } 
  catch (error) {
    return res.sendStatus(500)
  }
}

const getEmails = async (req, res) => {
  try{  
    const emails = await Emails.findAll()
    return res.status(200).json({ emails })
  }
  catch (error) {
    return res.sendStatus(500)
  }
}

//////////////// ENDPOINTS ////////////////

// Contact endpoint
app
  .post('/contact/submit', verifyRecaptcha, submitContact)

// Email endpoint
app
  .post('/email/submit', submitEmail)

// Filler endpoints
app
  .get('/', (req, res) => res.sendFile('test.html', {root: __dirname}))

// Testing recaptcha
// app
//   .post('/recaptcha', verifyRecaptcha)

// Testing endpoints (expose DB)
app
  .get('/email', getEmails)

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//////////////// AUXILIARY FUNCTIONS ////////////////

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

const validEmail = (email) => {
  return re.test(email);
}

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