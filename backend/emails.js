const { Emails } = require("./tables.js")
const validEmail = require('./utils.js')

const nodemailer = require('nodemailer')
require('dotenv').config()
const NURLABS_EMAIL = process.env.NURLABS_EMAIL;
const NURLABS_PASS = process.env.NURLABS_PASS;
// const tempURL = 'https://www.gonurlabs.com'
const tempURL = 'http://localhost:3000'

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

const submitEmail = async (req, res) => {
  try {
    // console.log(req.body);
    if(!validEmail(req.body.email)) return res.sendStatus(400)
    const result = await Emails.create({email: req.body.email})
    sendConfirmation(result.email, result.uuid)
    return res.sendStatus(201)
  } 
  catch (error) {
    // console.log(error);
    return res.sendStatus(500)
  }
}

const sendConfirmation = (recipient, uuid) => {
  const mailOptions = {
    from: NURLABS_EMAIL, // Sender address
    to: recipient,         // List of recipients
    subject: 'You have been successfully subscribed!', // Subject line
    html: `
    <div>
      <p>Thanks for choosing to stay connected with us!</p>
      <a target="_blank" href='${tempURL}/unsubscribe?email=${recipient}&key=${uuid}'>Unsubscribe</a>
    </div>
    `, 
  };

  transport.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
}

const unsubscribeEmail = async (req, res) => {
  try {
    // TODO: Instead of doing this, use schema validation
    if (!req.body.uuid || !req.body.email) return res.sendStatus(400)
    const email = await Emails.findByPk(req.body.uuid)
    if (email === null || email.email !== req.body.email) return res.sendStatus(404)
    await email.destroy()
    return res.sendStatus(200)
  } 
  catch (error) {
    return res.sendStatus(500)
  }
}

const checkEmail = async (req, res) => {
  try {
    if (!req.query.uuid || !req.query.email) return res.sendStatus(400)
    const email = await Emails.findByPk(req.query.uuid)
    if (email === null || email.email !== req.query.email) return res.sendStatus(404)
    return res.sendStatus(200)
  } 
  catch (error) {
    return res.sendStatus(500)
  }
}

const getEmails = async (req, res) => {
  try {  
    const emails = await Emails.findAll();
    return res.status(200).json({ emails });
  }
  catch (error) {
    return res.sendStatus(500);
  }
}

module.exports = {submitEmail, unsubscribeEmail, checkEmail, getEmails};