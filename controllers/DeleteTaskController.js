const TaskService = require('../services')
const { StatusCodes } = require('http-status-codes');

class DeleteTaskController {
    async handle(req,res){
        const { id } = req.params;
        const service = new TaskService();

        await service.deleteTask(id);

        return res.status(StatusCodes.NO_CONTENT).send()
    }
}

module.exports = DeleteTaskController;