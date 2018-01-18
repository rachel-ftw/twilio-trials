const http = require('http')
const express = require('express')
const bodyParser = require('body-parser');
const { createStore } = require('redux')
const { MessagingResponse } = require('twilio').twiml

const { list } = require('./data')
const {
  parseSMS,
  createTodo,
  formatTodos,
  instructions,
} = require('./helpers')

const app = express()
app.use(bodyParser.urlencoded({extended: false}));

//constants
const ADD_TODO = 'ADD_TODO'
const COMPLETE_TODO = 'COMPLETE_TODO'
const DELETE_TODO = 'DELETE_TODO'

//actions
const addNewTodo = text => ({ type: ADD_TODO, text })
const completeTodo = id => ({ type: COMPLETE_TODO, id })
const deleteTodo = id => ({ type: DELETE_TODO, id })

//reducer
function todos(state=[], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, createTodo(action.text)]
    
    case COMPLETE_TODO:
      return state.map(todo => {
        return todo.id === parseInt(action.id) ?
          Object.assign({}, todo,{ complete: true }) : 
          todo
      })
    
    case DELETE_TODO:
      return state.filter(todo => todo.id !== action.id)
    
    default:
      return state
  }
}

let store = createStore(todos)
store.subscribe(() => console.log('store: ', store.getState()))
store.dispatch(addNewTodo('get milk'))
store.dispatch(addNewTodo('go on an adventure'))

app.post('/sms', (req, res) => {
  const { Body } = req.body
  const twiml = new MessagingResponse()
  let parsedSMS = parseSMS(Body)
  let { action, content } = parsedSMS
  
  if (action === 'add') {
    store.dispatch(addNewTodo(content))
    twiml.message(`added todo: ${content}`)
  
  } else if (action === 'list') {
    twiml.message(formatTodos(store.getState()))
  
  } else if (action === 'complete') {
    store.dispatch(completeTodo(content))
    twiml.message(`complete todo: ${content}`)
  
  } else if (action === 'delete') {
    store.dispatch(deleteTodo(content))
    twiml.message(`deleted todo: ${content}`)
  
  } else {
    twiml.message(instructions)
  }
  
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

http.createServer(app).listen(3002, () => console.log('connected on port 3k2 💅'))

module.exports = { ADD_TODO }
