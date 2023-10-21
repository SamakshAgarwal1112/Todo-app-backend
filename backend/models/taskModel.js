const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    todo:{
        type: String,
        required: [true, 'Please enter a task.']
    },
    completed:{
        type: Boolean,
        default: false,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},
{
    timestamps: true,
    collection: "todos",
})

module.exports = mongoose.model('Task', taskSchema);