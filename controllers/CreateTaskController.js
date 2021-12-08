const TaskService = require('../services')
const { StatusCodes } = require('http-status-codes');

class CreateTaskController {
    async handle(req,res){
        const { name } = req.body;

        const service = new TaskService();

        let task = await service.createTask(name);

        return res.status(StatusCodes.CREATED).json({ task })
    }
}

module.exports = CreateTaskController;