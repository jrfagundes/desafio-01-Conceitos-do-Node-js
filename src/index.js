const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { json } = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  console.log(user.username);
  if(!user) {
    return response.status(400).json({Error: "User not found!"})
  }

  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { username, name } = request.body;

  const userAlredyExists = users.some((user) => {
    user.username === username;
  }, 1);

  if(userAlredyExists) {
    return response.status(400).json({Erro: "Usuário já cadastrado!"});
  }

  users.push({
    id:uuidv4(),
    name,
    username,
    todos: [],    
  });
  return response.status(201).json(users.find((user) => user.username === username));
});

app.get('/users', (request, response) => {
  return response.json(users);
}); 



app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
    
    return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

    const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    create_at: new Date(),
  }

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  user.title = title;
  user.deadline = deadline;
  return response.status(201).json(user);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { done } = reques.body;
  user.done = done;
  return response.status(201).json(user);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  custumers.splice(user, 1);

  return response.json(user);
});

module.exports = app;