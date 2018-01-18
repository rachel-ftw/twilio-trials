const http = require('http')
const express = require('express')
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml

const app = express()
app.use(bodyParser.urlencoded({extended: false}));

app.post('/sms', (req, res) => {
  const { Body } = req.body
  const twiml = new MessagingResponse()
  
  twiml.message('haii: ', Body)

  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

http.createServer(app).listen(3000, () => console.log('connected on port 3k 😺'))
