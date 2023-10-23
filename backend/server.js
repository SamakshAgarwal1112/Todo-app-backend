const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3001;
const connectDB = require('./config/db');
const {errorHandler} = require('./middlewares/errorMiddleware');

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.status(200).send({message: "welcome to the todo - app - api!"});
})

app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
})