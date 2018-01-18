
let todoId = 0
function _incrementId(id) {
  return ++ todoId
}

function createTodo(text){
  return {
    id: _incrementId(todoId),
    text,
    complete: false,
  }
}

function parseSMS(sms) {
  let smsArray = sms.split(' ').map(word => word.toLowerCase())
  let action = smsArray.slice(0, 1)[0]
  let content = smsArray.slice(1, smsArray.length).join(' ')
  return { action, content }
}

const instructions = `
Welcome to Text Todo! 💅
input: [keyword] [data]
- 'add todo-text-here'
- 'list'
- 'delete todoId'
- 'complete todoId'
`

function formatTodos(store) {
  let formatted = store.map(todo => 
    `id ${todo.id}: ${todo.text} -- ${todo.complete ? '👍 💃' : '💩 💀'}`
  ).join('\n')
  return formatted
}

module.exports = {
  createTodo, 
  parseSMS, 
  formatTodos,
  instructions,
}