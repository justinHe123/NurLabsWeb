//////////////// SETUP ////////////////

const express = require('express')
const cors = require('cors');
const { Emails } = require("./tables.js")
const verifyRecaptcha = require("./recaptcha.js")
const submitContact = require('./contact.js')
const validEmail = require('./utils.js')

const corsOptions = {
  origin: ['http://localhost:3000', 'https://www.nurlabs.net/'],
  optionsSuccessStatus: 200 
}

const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions));
app.use(express.json()) // bodyParser is depreciated, use this instead :o

//////////////// ENDPOINT FUNCTIONS ////////////////

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
    if (!req.query.uuid || !req.query.email) return res.sendStatus(400)
    const email = await Emails.findByPk(req.query.uuid)
    if (email === null || email.email !== req.query.uuid) return res.sendStatus(404)
    return res.sendStatus(200)
  } 
  catch (error) {
    return res.sendStatus(500)
  }
}

const getEmails = async (req, res) => {
  try{  
    const emails = await Emails.findAll();
    return res.status(200).json({ emails });
  }
  catch (error) {
    return res.sendStatus(500);
  }
}

//////////////// ENDPOINTS ////////////////

// Contact endpoint
app
  .post('/contact/submit', verifyRecaptcha, submitContact)

// Email endpoints
app
  .post('/email/submit', verifyRecaptcha, submitEmail);
app
  .post('/email/unsubscribe', /* verifyRecaptcha, */ unsubscribeEmail)
app
  .get('/email/check', checkEmail)

// Filler endpoints
app
  .get('/', (req, res) => res.sendFile('test.html', {root: __dirname}));

// Testing recaptcha
// app
//   .post('/recaptcha', verifyRecaptcha)

// Testing endpoints (expose DB)
app
  .get('/email', getEmails);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//////////////// AUXILIARY FUNCTIONS ////////////////
