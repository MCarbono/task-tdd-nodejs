const TaskService = require('../services')
const { StatusCodes } = require('http-status-codes');

class UpdateTaskController {
    async handle(req,res){
        const { id } = req.params;

        const service = new TaskService();

        let task = await service.updateTask(id, req.body);

        return res.json({ task })
    }
}

module.exports = UpdateTaskController;