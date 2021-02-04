let bubble = document.getElementById('bubble');
let todo = document.getElementById('todo');
let todoInput = document.getElementById('todo-input');
let maxId = 0;

function makeBubbleInvisible() {
  bubble.style.opacity = 0;
}

function makeBubbleVisible() {
  bubble.style.opacity = 1;
}

function makeNameInputInvisible() {
  let input = document.getElementById('name-input');
  input.style.display = 'none';
}

function onEnterName(event) {
  if (event.key === 'Enter') {
    let name = event.target.value;
    window.localStorage.setItem('name', name);
    bubble.innerText = `Hi, ${name},\n Glad to meet you!`;
    makeNameInputInvisible();
    setTimeout(() => {
      makeBubbleInvisible();
    }, 3000);
  }
}

function handleName() {
  let name = window.localStorage.getItem('name');
  if (name) {
    bubble.innerText = `Hi, ${name}.\n Welcome back!`;
    makeNameInputInvisible();
    setTimeout(() => {
      makeBubbleInvisible();
    }, 3000);
  } else {
    let input = document.getElementById('name');
    input.addEventListener('keydown', onEnterName);
  }
}

function addTodo(id, value, status, isInit) {
  let todoData = localStorage.getItem('todo');
  let todoList = todoData ? JSON.parse(todoData) : [];

  let newTodo = document.createElement('li');

  newTodo.innerHTML = `<span>${value}</span>`;
  if (status === 'pending') {
    newTodo.className = 'pending';
  } else {
    newTodo.className = 'done';
  }

  let doneButton = document.createElement('button');
  doneButton.style.color = '#27ae60';
  doneButton.innerHTML = '&check;';
  doneButton.addEventListener('click', () => {
    newTodo.className = newTodo.className === 'pending' ? 'done' : 'pending';
    let target = todoList.find((i) => i.id === id);
    target.status = target.status === 'pending' ? 'done' : 'pending';
    localStorage.setItem('todo', JSON.stringify(todoList));
    setMaxId();
  });

  newTodo.appendChild(doneButton);

  let deleteButton = document.createElement('button');
  deleteButton.style.color = '#e74c3c';
  deleteButton.innerHTML = '&Chi;';
  deleteButton.addEventListener('click', () => {
    todo.removeChild(newTodo);

    todoList = todoList.filter((i) => i.id !== id);
    localStorage.setItem('todo', JSON.stringify(todoList));
    setMaxId();
  });
  newTodo.appendChild(deleteButton);

  todo.appendChild(newTodo);
  todoInput.value = '';

  if (!isInit) {
    todoList.push({
      id,
      value,
      status
    });

    localStorage.setItem('todo', JSON.stringify(todoList));
    setMaxId();
  }
}

function onEnterTodo(event) {
  if (event.key === 'Enter') {
    let value = event.target.value;
    addTodo(maxId + 1, value, 'pending');
  }
}

function setMaxId() {
  let todoData = localStorage.getItem('todo');
  let todoList = todoData ? JSON.parse(todoData) : [];
  if (todoList.length > 0) {
    for (const todo of todoList) {
      if (todo.id > maxId) {
        maxId = todo.id;
      }
    }
  }
}

function setDefaultTodo() {
  let todoData = localStorage.getItem('todo');
  let todoList = todoData ? JSON.parse(todoData) : [];
  for (const todo of todoList) {
    const { id, value, status } = todo;
    addTodo(id, value, status, true);
  }
}

function handleTodo() {
  todoInput.addEventListener('keydown', onEnterTodo);
  setMaxId();
  setDefaultTodo();
}

function init() {
  handleName();
  handleTodo();
}

init();
