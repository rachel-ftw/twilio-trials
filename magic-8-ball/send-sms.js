require('dotenv').config()
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_MAGIC8
const myCell = process.env.MY_CELL

const client = require('twilio')(accountSID, authToken)
const { answers } = require('./data')
const { findRandomIndex } = require('./helpers')

client.messages
  .create({
    to: myCell,
    from: twilioPhone,
    body: answers[findRandomIndex((answers.length - 1))]
  })
  .then(m => console.log(m.sid))
  .catch(e => console.error(e))
