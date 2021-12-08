const TaskRepository = require('../repository/TaskRepository');

const {
    ConflictError,
    BadRequestError,
    NotFoundError
} = require('../errors');

class Service {
    constructor() {
        this.repository = new TaskRepository();
    }

    async createTask(name) {
        if (name.length > 20) throw new BadRequestError('name exceeded max length.')
        
        const taskExists = await this.repository.getTaskByName(name)
        
        if (taskExists) throw new ConflictError(`A task with name ${name} already exists`)
        
        let task = await this.repository.createTask({ name });
        
        return task;
    }

    async getTask (id) {
        return await this.repository.getTask(id);
    }

    async getTasks () {
        return await this.repository.getAllTasks();
    }

    async updateTask (id, body) {
        if (body.name.length > 20) throw new BadRequestError('name exceeded max length.')

        const taskExists = await this.repository.getTask(id)

        if (!taskExists) throw new NotFoundError('Task not founded')

        return await this.repository.updateTask(id, body)
    }

    async deleteTask (id){
        const task = await this.repository.deleteTask(id)
        if (!task) throw new NotFoundError('Task not founded')
        return task;
    }
}

module.exports = Service;

