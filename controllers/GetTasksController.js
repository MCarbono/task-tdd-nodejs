const TaskService = require('../services')

class GetTasksController {
    async handle(req,res){
        const service = new TaskService();

        let tasks = await service.getTasks();

        return res.json({tasks})
    }
}

module.exports = GetTasksController;