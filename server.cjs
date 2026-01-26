/*const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    console.log("🔥 REQUEST RECEIVED");
    res.json("OK");
});

app.listen(3000, () => {
    console.log("🔥 SERVER STARTED");
});*/

const express = require("express");//imports express library
const app = express();//creates an express aplication object
app.use(express.json());//tells Express to automatically parse incoming JSON requests.
console.log("Server starting");
app.use(express.static("public"));//// Serve frontend files from "public" folder

//in memory storage
let todos=[];
let idCounter=1;

//test root route
/*app.get("/",(req,res)=>{
    console.log("Request recieved");
    res.json("OK");
});*/

//get all todos
app.get("/todos",(req,res)=>
{
    res.json(todos);
});

//add a new todo
app.post("/todos",(req,res)=>{
    const{title}=req.body;//extracts the title from the incoming JSON body., to convert raw json text into js object
    if(!title) return res.status(400).json({error:"Title is required"});
    const newTodo = {//create a newTodo 
        id:idCounter++,title,completed:false};//new task start as not completed
        todos.push(newTodo);//adds the new todo into the server array
        res.status(201).json(newTodo);//sends newly created todo back to the frontend
});

//update a todo
app.put("/todo/:id",(req,res)=>{
    const id = parseInt(req.params.id);//converts the id from string to number, get ID from URL
    const { title,completed} =req.body;//get updated values from client.
    const todo=todos.find(t=>t.id===id);//convert it to number
    if(!todo) return res.status(404).json({error:"Todo is not found"});//find the todo in memory.
    if(title!==undefined) todo.title=title;
    if(completed!==undefined) todo.completed=completed;
    res.json(todo);
});
//delete a todo
app.delete("/todos/:id",(req,res)=>{
    const id = parseInt(req.params.id);//get numeric ID from URL.
    const index = todos.findIndex(t=>t.id===id);
    if(index===-1) return res.status(404).json({error:"Todo not found"});
    const deleted = todos.splice(index,1);
    res.json(deleted[0]);
});
app.listen(3000,()=>{//tells Express to start the server on port 3000.
    console.log(" SERVER STARTED on http://localhost:3000");
});
//listen all requests on this port and response accordigly