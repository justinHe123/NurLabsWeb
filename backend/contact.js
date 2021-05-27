const { promisify } = require('util')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const validEmail = require('./utils.js')

const readFile = promisify(fs.readFile);
require('dotenv').config()
const NURLABS_EMAIL = process.env.NURLABS_EMAIL;
const NURLABS_PASS = process.env.NURLABS_PASS;

// TODO: temporary email transport using mailtrap
let transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: NURLABS_EMAIL,
    pass: NURLABS_PASS,
  },
  tls: {
    rejectUnauthorized: false
  } 
})

const submitContact = (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;

    if (!validEmail(email)) res.sendStatus(400);
    sendConfirmation(email);
    sendNurlabsFeedback(req.body);
    res.sendStatus(200);
  }
  catch (error) {
    return res.sendStatus(500);
  }
}

const sendConfirmation = async (recipient) => {
  const mailOptions = {
    from: NURLABS_EMAIL, // Sender address
    to: recipient,         // List of recipients
    subject: 'Your feedback was submitted!', // Subject line
    html: await readFile('./templates/confirm.html', 'utf8'), 
  };

  sendMail(mailOptions);
}

const sendNurlabsFeedback = async (body) => {
  const { email, subject, text } = body;
  const html = await readFile('./templates/feedback.html', 'utf8');
  const template = handlebars.compile(html);
  const htmlToSend = template({ topic: subject, body: text });

  const mailOptions = {
    from: NURLABS_EMAIL, // Sender address
    to: NURLABS_EMAIL,         // List of recipients
    subject: `FEEDBACK - From: ${email}`, // Subject line
    html: htmlToSend, 
  };

  sendMail(mailOptions);
}

const sendMail = (opts) => {
  transport.sendMail(opts, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
}

module.exports = submitContact;