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

// Filler endpoints
app
  .get('/', (req, res) => res.sendFile('test.html', {root: __dirname}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
