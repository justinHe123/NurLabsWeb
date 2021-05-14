//////////////// SETUP ////////////////

const express = require('express')
const cors = require('cors');
const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
const { Emails } = require("./tables.js")
const verifyRecaptcha = require("./recaptcha.js")

const corsOptions = {
  origin: ['http://localhost:3000', 'https://www.nurlabs.net/'],
  optionsSuccessStatus: 200 
}

const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions));
app.use(express.json()) // bodyParser is depreciated, use this instead :o

const readFile = promisify(fs.readFile);

//////////////// ENDPOINT FUNCTIONS ////////////////

const submitContact = (req, res) => {
  try {
    console.log(req.body);
    const { email, subject, text} = req.body;

    if (!validEmail(email)) res.sendStatus(400)
    sendConfirmation(email)
    // TODO: send feedback email to nurlabs
    res.sendStatus(200)

  }
  catch (error) {
    return res.sendStatus(500)
  }
}

const submitEmail = async (req, res) => {
  try {
    if(!validEmail(req.body.email)) return res.sendStatus(400)
    await Emails.create({email: req.body.email})
    return res.sendStatus(201)
  } 
  catch (error) {
    return res.sendStatus(500)
  }
}

const unsubscribeEmail = async (req, res) => {
  try {
    // TODO: Instead of doing this, use schema validation
    if (!req.body.uuid || !req.body.email) return res.sendStatus(400)
    const email = await Emails.findByPk(req.body.uuid)
    if (email === null || email.email !== req.body.uuid) return res.sendStatus(404)
    await email.destroy()
    return res.sendStatus(200)
  } 
  catch (error) {
    return res.sendStatus(500)
  }
}

const checkEmail = async (req,res) => {
  try{
    if (!req.body.uuid || !req.body.email) return res.sendStatus(400)
    const email = await Emails.findByPk(req.body.uuid)
    if (email === null || email.email !== req.body.uuid) return res.sendStatus(404)
    return res.sendStatus(200)
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

// Email endpoints
app
  .post('/email/submit', verifyRecaptcha, submitEmail)
app
  .post('/email/unsubscribe', /* verifyRecaptcha, */ unsubscribeEmail)
app
  .get('/email/check', checkEmail)

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