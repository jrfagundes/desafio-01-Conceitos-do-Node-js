const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const { json } = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const todos = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(400).json({ Error: "User not found!" })
  }

  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  const { username, name } = request.body;
  const usernameAlredyExists = users.some((user) => user.username === username);

  if (usernameAlredyExists) {
    return response.status(400).json({ "error" : "Este usuário já esá cadastrado" })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);  

  return response.status(201).json(user);
});

app.get("/users", (request, response) => {
  return response.json(users);
});



app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const id = uuidv4();

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).send(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  const todo = user.todos.find((todo) => todo.id === id);
  
  if (!todo) {
      return response.status(404).json({ error: "Todo id not found!" });
  }
    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((todo) => todo.id === id);
  
  if (!todo) {
      return response.status(404).send({ error: "Todo id not found!" });
  }
    
  todo.done = true;
  return response.json(todo);
    
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((todo) => todo.id === id);
  const index = user.todos.indexOf(todo);
  if (index === -1) {
    return response.status(404).json({ error: "Todo not found" });
  }
  
  user.todos.splice(index, 1);

  return response.status(204).send();
});

module.exports = app;