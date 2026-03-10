// Load todos when page opens
/*window.onload = loadTodos;

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
    const todoTextElement = document.createElement("span");
    todoTextElement.textContent = todo.title;
    if (todo.completed) todoTextElement.style.textDecoration = "line-through";
     
    //Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => startEditTodo(todo._id,todoTextElement);
    

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTodo(todo._id);

    li.appendChild(checkbox);
    li.appendChild(todoTextElement);
    li.appendChild(editBtn);
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

function startEditTodo(id, todoTextElement){
  const currentText = todoTextElement.textContent;// because we want the input box to start with the existing text not to be empty, do we put the content inside it first.

  const editinput = document.createElement("input");//create a textbox, does not appear on the page yet.
  editinput.type = "text"; //make it a text input.
  editinput.value = currentText; //put old text inside the old todo text.
 todoTextElement.replaceWith(editinput);// remove the <span> from DOM and put the <input> in the exact same place 
  editinput.focus();//automatically places the cursor inside the input, UX improvement

  editinput.addEventListener("keypress",function(e) {//enter and blur belong to the input , not the button
    if(e.key === "Enter"){
      finishEditTodo(id,editinput,todoTextElement);
    }
  });

  editinput.addEventListener("blur",function()
  {
    finishEditTodo(id,editinput,todoTextElement);
  });
}

async function finishEditTodo(id, editinput,todoTextElement ){
  const newTitle = editinput.value.trim();
  if(!newTitle)
  return loadTodos();

  await fetch(`/todos/${id}`,{
    method:"PUT",
    headers:{ "Content-Type": "application/json"},
    body:JSON.stringify({title:newTitle})
  });
  loadTodos();
}
//Edit functionality flow:
//We first display the todo as plain text using a span (view mode).
// When the Edit button is clicked, that span is replaced with an input box containing the same text so the user can modify it.
// After pressing Enter or clicking outside, the text is trimmed, sent to the backend using a PUT request, and the UI reloads with the updated value.*/


// index.js - Todo App with JWT Authentication

document.addEventListener("DOMContentLoaded", () => {
  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    };
  }

  // Load todos initially
  loadTodos();

  // Add todo form submit
  const form = document.getElementById("todoForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addTodo();
    });
  }

  // Apply filter button
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", () => {
      loadTodos();
    });
  }

  // Clear filter button
  const clearFilterBtn = document.getElementById("clearFilterBtn");
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", () => {
      document.getElementById("completedFilter").value = "";
      document.getElementById("searchInput").value = "";
      loadTodos();
    });
  }
});




// -------------------- Load Todos --------------------
async function loadTodos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Login is required!");
    window.location.href = "login.html";
    return;
  }

  const completed = document.getElementById("completedFilter")?.value;
  const search = document.getElementById("searchInput")?.value.trim();
  
  const params = new URLSearchParams();
  if(completed) params.append("completed",completed);
  if(search) params.append("search", search);

  try {
    const res = await fetch("/todos?" + params.toString(), {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const todos = await res.json();
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    todos.forEach(todo => {
      const li = document.createElement("li");

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.onchange = () => toggleTodo(todo._id, checkbox.checked);

      // Todo text
      const span = document.createElement("span");
      span.textContent = todo.title;
      if (todo.completed) span.style.textDecoration = "line-through";

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => startEditTodo(todo._id, span);

      // Delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteTodo(todo._id);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load todos. Try again.");
  }
}

// -------------------- Add Todo --------------------
async function addTodo() {
  const token = localStorage.getItem("token");
  const input = document.getElementById("todoInput");
  const title = input.value.trim();
  if (!title) return;

  try {
    await fetch("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    input.value = "";
    loadTodos();
  } catch (err) {
    console.error(err);
    alert("Failed to add todo.");
  }
}

// -------------------- Toggle Todo Completion --------------------
async function toggleTodo(id, completed) {
  const token = localStorage.getItem("token");
  try {
    await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ completed })
    });
    loadTodos();
  } catch (err) {
    console.error(err);
    alert("Failed to update todo.");
  }
}

// -------------------- Delete Todo --------------------
async function deleteTodo(id) {
  const token = localStorage.getItem("token");
  try {
    await fetch(`/todos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    loadTodos();
  } catch (err) {
    console.error(err);
    alert("Failed to delete todo.");
  }
}

// -------------------- Edit Todo --------------------
function startEditTodo(id, todoTextElement) {
  const currentText = todoTextElement.textContent;
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = currentText;
  todoTextElement.replaceWith(editInput);
  editInput.focus();

  editInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") finishEditTodo(id, editInput);
  });

  editInput.addEventListener("blur", function () {
    finishEditTodo(id, editInput);
  });
}

async function finishEditTodo(id, editInput) {
  const newTitle = editInput.value.trim();
  if (!newTitle) return loadTodos();

  const token = localStorage.getItem("token");
  try {
    await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle })
    });
    loadTodos();
  } catch (err) {
    console.error(err);
    alert("Failed to update todo.");
  }
}