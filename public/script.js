// Load todos when page opens
window.onload = loadTodos;

// Function to fetch and display todos
async function loadTodos() {
  const res = await fetch("/todos");//processes the request still js works like scroll,clicks etc,it contains response object.*get the package*
  const todos = await res.json();//open it as JSON
  //1. When you get a response from a server, the body is just text (usually JSON text), not a JavaScript object yet.
  //2. const todos = await res.json-> Reads the raw text from the HTTP response body
  //Runs JSON.parse() internally,Converts the JSON text → real JavaScript object/array, now js understands it and you can  access and iterate over js objects and arrays.

  const list = document.getElementById("todoList");//this finds an element in your HTML that has "todoList",to let js control and change that part of the web page.
  list.innerHTML = "";//this removes everything inside that element

  todos.forEach(todo => {
    const li = document.createElement("li");//for each todo, the code creates a new <li>, puts the todo text inside it , adds a style if its complete.
    li.textContent = todo.title;
    li.className = todo.completed ? "completed" : "";

    // Toggle completion button
    const toggleBtn = document.createElement("button");//creates new html button element in memory
    toggleBtn.textContent = todo.completed ? "Undo" : "Complete";//sets the button text depending on whether the todo is done.
    toggleBtn.onclick = () => toggleTodo(todo.id, !todo.completed);// when clicked, calls a function to flip(toggle) that todos's completed state.

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(toggleBtn);//attach buttons to <li>
    li.appendChild(delBtn);//attach buttons to <li>
    list.appendChild(li);//attach <li> to main list
  });
}

// Add a new todo
async function addTodo() {//contacting backend for http post request to your server
  const input = document.getElementById("todoInput");//gets <input> element
  const title = input.value.trim();//reads user text
  if (!title) return;//stops if input is empty

  await fetch("/todos", {//http post request to your server
    method: "POST",
    headers: { "Content-Type": "application/json" },//tells server that data is sent into JSON format
    body: JSON.stringify({ title })// http can only send text na so js object get converted into JSON string
  });

  input.value = "";//clear the input box
  loadTodos();//rebuilds the list with update data.
}

// Toggle completion
async function toggleTodo(id, completed) {
  await fetch(`/todo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  loadTodos();
}

// Delete todo
async function deleteTodo(id) {
  await fetch(`/todos/${id}`, { method: "DELETE" });
  loadTodos();
}
