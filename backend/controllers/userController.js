const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Post new user / Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("please add all the fields!");
    }
    // check if user exists
    const user = await User.findOne({email});
    if(user){
        res.status(400);
        throw new Error('user already exists!');
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    })
    if(newUser){
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            token: generateToken(user._id, user.email)
        })
    } else {
        res.status(400);
        throw new Error('Inavlid user data');
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    // check for user email
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id, user.email)
        })
    } else {
        res.status(400);
        throw new Error('Inavlid credentials');
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async(req, res) => {
    const {_id, name, email} = await User.findById(req.user.id);
    res.status(200).json({
        id: _id,
        name,
        email,
    })
})

// Generate JWT
const generateToken = (id, email) => {
    return jwt.sign({id, email}, process.env.JWT_SECRET,{
        expiresIn: '30d',
    } )
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}