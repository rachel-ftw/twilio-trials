require('dotenv').config()
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE
const myCell = process.env.MY_CELL

const client = require('twilio')(accountSID, authToken)

const { findRandomIndex, answers } = require('./helpers')

client.messages
  .create({
    to: myCell,
    from: twilioPhone,
    body: answers[findRandomIndex((answers.length - 1))]
  })
  .then(msg => console.log(msg.sid))
  .catch(e => console.error(e))
