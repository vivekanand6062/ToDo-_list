const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User');
app.use(cookieParser());
const TodoModel = require('./models/Todo');
require('dotenv').config();


const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URI;

app.use(cors({
    origin: ["http://localhost:3000"], // Aapke frontend ka URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Cookies allow karne ke liye
}));
app.use(express.json());

// MongoDB Connection (Apna link yahan daalna)
mongoose.connect(MONGO_URL)

// Schema (Data kaisa dikhega)
const todoSchema = new mongoose.Schema({ task: String });
const Todo = mongoose.model('Todo', todoSchema);

// --- SIGNUP API ---
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ name, email, password: hashedPassword });
        res.json("Success");
    } catch (err) {
        res.status(500).json(err);
    }
});


// --- LOGIN API ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    
    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            
            const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ status: "Success", name: user.name });
        } else {
            return res.json("Password galat hai");
        }
    } else {
        return res.json("User nahi mila");
    }
});






// User ko verify karne ka rasta
app.get('/verify', (req, res) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json("Token missing");
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json("Token wrong");
            return res.json({status: "Success", name: decoded.name});
        });
    }
});

// Logout API
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({status: "Success"});
});



// 1. Mark as Done (Update status)
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    
    TodoModel.findById(id)
    .then(todo => {
        // Toggle logic: true ko false, false ko true
        const newStatus = !todo.done;

        TodoModel.findByIdAndUpdate(
            id, 
            { done: newStatus }, 
            { returnDocument: 'after' } // Warning yahan fix ho gayi!
        )
        .then(result => res.json(result))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

// 2. Delete Task
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    Todo.findByIdAndDelete({_id: id})
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});



// Routes
app.get('/get', (req, res) => {
    Todo.find().then(result => res.json(result));
});

// server/index.js ke andar
app.post('/add', (req, res) => {
    // Ye line aapke terminal mein data dikhayegi
    console.log("Frontend se ye data aaya:", req.body);

    const { task, category, dueDate } = req.body;

    // Direct create karo aur dekho terminal kya bolta hai
    TodoModel.create({
        task: task,
        category: category || "General",
        dueDate: dueDate,
        done: false
    })
    .then(result => {
       
        res.json(result);
    })
    .catch(err => {
        console.log("Database mein error hai bhai:", err);
        res.status(500).json(err);
    });
});

app.listen(PORT , () => console.log("Server running on port 3001"));


