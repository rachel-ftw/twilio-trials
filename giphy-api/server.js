require('dotenv').config()
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser');
const fetch = require('node-fetch')
const { MessagingResponse } = require('twilio').twiml

const giphyAPIKey = process.env.GIPHY_API_KEY

const app = express()
app.use(bodyParser.urlencoded({extended: false}));

app.post('/sms', (req, res) => {
  const { Body } = req.body
  const twiml = new MessagingResponse()
  const url = `http://api.giphy.com/v1/gifs/translate?api_key=${giphyAPIKey}&s=${Body}`
  
  fetch(url)
    .then(response => response.json())
    .then(payload => {
      twiml.message(payload.data.images.looping.mp4)
      res.writeHead(200, {'Content-Type': 'text/xml'})
      res.end(twiml.toString())
    })
    .catch(e => console.error(e))
})

http.createServer(app).listen(3000, () => console.log('connected on port 3k 😺'))
