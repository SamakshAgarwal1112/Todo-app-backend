const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {getTasks, getTask, addTask, updateTaskContent, updateTaskStatus, deleteTask, getCompletedTasks, getIncompletedTasks } = require('../controllers/taskController');

router.get('/', protect, getTasks);
router.get('/completed', protect, getCompletedTasks);
router.get('/incompleted', protect, getIncompletedTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, addTask);
router.put('/updatecontent/:id', protect, updateTaskContent);
router.put('/:id', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

module.exports = router;