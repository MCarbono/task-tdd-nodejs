const { Router } = require('express');
const router = Router();

// const {
//     createTask,
//     getTask,
//     updateTask,
//     deleteTask,
//     getTasks,
// } = require('../services')

const {
    CreateTaskController,
    GetTaskController,
    GetTasksController,
    UpdateTaskController,
    DeleteTaskController
} = require('../controllers')

//Task Routes
router.get('/tasks', new GetTasksController().handle)
router.post('/tasks', new CreateTaskController().handle)

router.get('/tasks/:id', new GetTaskController().handle)
router.put('/tasks/:id', new UpdateTaskController().handle)
router.delete('/tasks/:id', new DeleteTaskController().handle)

module.exports = router;