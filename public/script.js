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
    const li = document.createElement("li");

    // Checkbox for completion
    const checkbox = document.createElement("input");//creating the checkbox and <input> makes a new HTML element in memory
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed; // reflects current state(can be either true or false) to match the actual todo status with mongo
    checkbox.onchange = () => toggleTodo(todo._id, checkbox.checked);//sends request to yr backend to update db

    // Todo text
    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.completed) span.style.textDecoration = "line-through";

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTodo(todo._id);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
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
  await fetch(`/todos/${id}`, {
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
