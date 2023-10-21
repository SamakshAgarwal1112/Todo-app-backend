const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {getTasks, addTask, updateTaskStatus, deleteTask, getCompletedTasks, getIncompletedTasks } = require('../controllers/taskController');

router.get('/', protect, getTasks);
router.get('/completed', protect, getCompletedTasks);
router.get('/incompleted', protect, getIncompletedTasks);
router.post('/', protect, addTask);
router.put('/:id', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

module.exports = router;