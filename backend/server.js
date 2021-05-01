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

const cors = require('cors');
app.use(cors());
app.use(express.json()) // body-parser depreciated, use this instead :o

const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
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

app.post('/contact/submit', 
  (req, res) => {
  console.log(req.body);
  const { email, subject, text} = req.body;

  if (!re.test(email)) {
    res.sendStatus(400);
  } else {
    sendConfirmation(email);
    // TODO: send feedback email to nurlabs
    res.sendStatus(200);
  }
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
