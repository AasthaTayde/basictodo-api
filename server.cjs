
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.static("public"));
console.log("Server Starting");

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/status",(req,res)=>{
    res.json({message:"Server is running",db:mongoose.connection.readyState});
});

const todoSchema = new mongoose.Schema({
    title:{ type:String,required:true},
    completed:{type:Boolean,default:false},
});

const Todo=mongoose.model("Todo",todoSchema);

app.get("/todos", async (req,res)=>{
    try{
        const todos = await Todo.find();
        res.json(todos);
    }
catch(err)
{
    res.status(500).json({error:"Server error"});
}
});

app.post("/todos", async (req, res)=>{
    try{
        const { title } = req.body;
        if (!title) return res.status(400).json({error:"Title is required"});

        const newTodo = await Todo.create({title});
        console.log("🟢 New todo saved to DB:", newTodo);
        res.status(201).json(newTodo);
    }
    catch(err)
    {
        res.status(500).json({error:"Server error"});
    }
});

app.put("/todos/:id",async(req,res)=>{
    try{
        const{ completed } =req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {completed },
            { new: true}
        );
        if (!updatedTodo) return res.status(404).json({error:"Todo not found"});
        res.json(updatedTodo);
    }
    catch(err)
    {
        res.status(500).json({error:"Server error"});
    }
    });

    app.delete("/todos/:id", async (req, res) => {
        try {
          const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
          if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });
      
          res.json(deletedTodo);
        } catch (err) {
          res.status(500).json({ error: "Server error" });
        }
      });
  
 
  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });