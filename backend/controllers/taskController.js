const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// @route  GET /api/tasks
// @desc   Get tasks of the user
// @access Private
const getTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find({user: req.user.id});
    res.json(tasks);
})

// @route  GET /api/tasks/completed
// @desc   Get completed tasks of the user
// @access Private
const getCompletedTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find({user: req.user.id, completed: true});
    res.json(tasks);
})

// @route  GET /api/tasks/incompleted
// @desc   Get incompleted tasks of the user
// @access Private
const getIncompletedTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find({user: req.user.id, completed: false});
    res.json(tasks);
})

// @route  POST /api/tasks
// @desc   Add user task
// @access Private
const addTask = asyncHandler(async(req, res) => {
    if(!req.body.todo){
        res.status(400);
        throw new Error("please add a task!");
    }
    const task = await Task.create({
        todo: req.body.todo,
        user: req.user.id,
        completed: false,
    })
    res.send(task);
})

// @route  PUT /api/tasks/:id
// @desc   Change user task status
// @access Private
const updateTaskStatus = asyncHandler(async(req, res) => {
    const task = await Task.findById(req.params.id);
    if(!task){
        res.status(400);
        throw new Error("Task not found!");
    }
    const taskStatus = task.completed;
    const user = await User.findById(req.user.id);
    // checking for user
    if(!user){
        res.status(401);
        throw new Error("User not found!");
    }
    // makes sure the logged in user matches the user of the task
    if(task.user.toString() !== user.id){
        res.status(401);
        throw new Error("User not authorized!");   
    }
    task.completed = !taskStatus;
    await task.save();
    res.status(200).json({
        success: true,
        message: "Task Status changed successfully!",
        completed: task.completed,
    });
})

// @route  DELETE /api/tasks/:id
// @desc   Delete user task
// @access Private
const deleteTask = asyncHandler(async(req, res) => {
    const task = await Task.findById(req.params.id);
    if(!task){
        res.status(400);
        throw new Error("Task not found!");
    }
    const user = await User.findById(req.user.id);
    // checking for user
    if(!user){
        res.status(401);
        throw new Error("User not found!");
    }
    // makes sure the logged in user matches the user of the task
    if(task.user.toString() !== user.id){
        res.status(401);
        throw new Error("User not authorized!");   
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.json({id: req.params.id});
})

module.exports = {
    getTasks,
    getCompletedTasks,
    getIncompletedTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
}