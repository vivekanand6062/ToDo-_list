const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: String,
    done: {
        type: Boolean,
        default: false // Naya task hamesha undone rahega
    },
    userId: String,
    category: { type: String, default: "General" },
    dueDate: String
});

const TodoModel = mongoose.model("todos", TodoSchema);
module.exports = TodoModel;