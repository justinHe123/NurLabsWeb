//////////////// SETUP ////////////////
const express = require('express')
const cors = require('cors');
const verifyRecaptcha = require("./recaptcha.js")
const submitContact = require('./contact.js')
const {submitEmail, unsubscribeEmail, checkEmail, getEmails} = require('./emails.js');

const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'https://www.nurlabs.net/', 
    'https://www.gonurlabs.com'
  ],
  optionsSuccessStatus: 200 
}

const app = express()
app.set('etag', false)
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions));
app.use(express.json()) // bodyParser is depreciated, use this instead :o

//////////////// ENDPOINTS ////////////////

// Contact endpoint
app
  .post('/contact/submit', verifyRecaptcha, submitContact)

// Email endpoints
app
  .post('/email/submit', verifyRecaptcha, submitEmail);
app
  .post('/email/unsubscribe', verifyRecaptcha, unsubscribeEmail)
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
