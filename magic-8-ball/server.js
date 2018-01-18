const http = require('http')
const express = require('express')
const { MessagingResponse } = require('twilio').twiml

const app = express()

const { answers } = require('./data')
const { findRandomIndex } = require('./helpers')

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse()
  
  twiml.message(answers[findRandomIndex((answers.length - 1))])
  
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

http.createServer(app).listen(3000, () => console.log('connected on port 3k 💅'))
