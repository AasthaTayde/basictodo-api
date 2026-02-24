
require("dotenv").config();//store secret or env-specific values outside your main code.
const express = require("express");//imports express library
const mongoose = require("mongoose");//import mongoose library to use in this file
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const app = express();//creates an express application object
app.use(express.json());//tells Express to automatically parse incoming JSON requests.
app.use(express.static("public"));// Serve frontend files from "public" folder
console.log("Server Starting");

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
//OR
/*try{
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
}
catch(err)
{
    console.error(err);
}*/


app.get("/status",(req,res)=>{
    res.json({message:"Server is running",db:mongoose.connection.readyState});
});//returns a number, 1:connected,0:disconnected.

const todoSchema = new mongoose.Schema({
    title:{ type:String,required:true},
    completed:{type:Boolean,default:false},
});//creates a mongoose schema for todo item

const Todo=mongoose.model("Todo",todoSchema);//containes in built functions

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
        const { title } = req.body;//extracts the title from the incoming JSON body., to convert raw json text into js object
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
        const{ completed, title } =req.body;
        const updateFields = {};
        if(completed!==undefined)updateFields.completed=completed;
        if(title!==undefined) updateFields.title = title;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            updateFields,
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

      app.post("/register",async (req,res) => {
        try {
            const { email, password } =req.body;
            if(!email || !password)//Basic validation
            {
                return res.status(400).json({ error:"Email and password required"});
            }
             //Check if user exists already
             const existingUser = await User.findOne({ email });
             if (existingUser)
             {
                return res.status(400).json({ error: "User already exists "});
             }
             //Hash Password
             const hashedPassword = await bcrypt.hash(password, 10);
             //Save User
             const newUser = await User.create({
                email,
                password: hashedPassword
             });
             res.status(201).json({ message: "User registered successfully"});

        }
        catch (err)
        {
            res.status(500).json({ error: "Server error"});
        }
      });
      app.post("/login", async (req, res) =>{
      try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user)
        {
            return res.status(400).json({ message: "Invalid credentials"});

        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );
        res.json({ token});
      }
      catch(err)
      {
        res.status(500).json({message:"Server error"});
      }
    });

      app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });