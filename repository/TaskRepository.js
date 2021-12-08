const Task = require('../models/Task');

class TaskRepository {
    createTask(task) {
        return Task.create(task);
    }

    getTask(id) {
        return Task.findById({ _id: id })
    }

    getAllTasks() {
        return Task.find({});
    }

    updateTask(id, body) {
        return Task.findOneAndUpdate({ _id: id }, body, {
            new: true,
            runValidators: true
        })
    }

    deleteTask(id) {
        return Task.findOneAndDelete({ _id: id })
    }

    getTaskByName(name) {
        return Task.findOne({ name })
    }
}

module.exports = TaskRepository;
