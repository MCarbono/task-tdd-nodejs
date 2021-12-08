const TaskService = require('../services')

class GetTaskController {
    async handle(req,res){
        const { id } = req.params;

        const service = new TaskService();

        let task = await service.getTask(id);

        return res.json({ task })
    }
}

module.exports = GetTaskController;