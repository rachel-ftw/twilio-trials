const http = require('http')
const express = require('express')
const bodyParser = require('body-parser');
const { createStore } = require('redux')
const { MessagingResponse } = require('twilio').twiml

const {
  parseSMS,
  createTodo,
  formatTodos,
  instructions,
  formatResponse,
} = require('./helpers')

const app = express()
app.use(bodyParser.urlencoded({extended: false}));

//constants
const ADD_TODO = 'ADD_TODO'
const COMPLETE_TODO = 'COMPLETE_TODO'
const DELETE_TODO = 'DELETE_TODO'

//actions
const actions = {
  add: (text) => ({ type: ADD_TODO, text }),
  complete: (id) => ({ type: COMPLETE_TODO, id }),
  delete: (id) => ({ type: DELETE_TODO, id }),
}

//reducer
function todos(state=[], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, createTodo(action.text)]

    case COMPLETE_TODO:
      return state.map(todo => {
        return todo.id === parseInt(action.id) ?
          Object.assign({}, todo, { complete: true }) :
          todo
      })

    case DELETE_TODO:
      return state.filter(todo => todo.id !== parseInt(action.id))

    default:
      return state
  }
}

let store = createStore(todos)
store.subscribe(() => console.log('store: ', store.getState()))
store.dispatch(actions.add('do a cartwheel'))
store.dispatch(actions.add('go on an adventure'))

app.post('/sms', (req, res) => {
  const { Body } = req.body
  const twiml = new MessagingResponse()
  let parsedSMS = parseSMS(Body)
  let { type, content } = parsedSMS

  if (type === 'list') {
    twiml.message(formatTodos(store.getState()))

  } else if (type === 'complete' || type === 'add' || type === 'delete') {
    store.dispatch(actions[type](content))
    twiml.message(formatResponse(type, content, formatTodos(store.getState())))

  } else {
    twiml.message(instructions)
  }

  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

http.createServer(app).listen(3000, () => console.log('connected on port 3k 💅'))
