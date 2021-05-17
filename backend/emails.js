const { Emails } = require("./tables.js")
const validEmail = require('./utils.js')

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

const checkEmail = async (req, res) => {
  try {
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
  try {  
    const emails = await Emails.findAll();
    return res.status(200).json({ emails });
  }
  catch (error) {
    return res.sendStatus(500);
  }
}

module.exports = {submitEmail, unsubscribeEmail, checkEmail, getEmails};