const Service = require('../../services')
const sinon = require('sinon');
const { 
    ConflictError, 
    BadRequestError, 
    NotFoundError 
} = require('../../errors');

const mocks = {
    validTaskGet: require('../mocks/validTaskGet.json'),
    validTaskCreate: require('../mocks/validTaskCreate.json'),
    validTaskCreate2: require('../mocks/validTaskCreate2.json'),
    invalidTaskCreateLength: require('../mocks/invalidTaskCreateLength.json'),
    validTaskUpdate: require('../mocks/validTaskUpdate.json')
}

const database = {
    created: require('./database/taskCreated.json'),
    updated: require('./database/taskUpdated.json'),
    deleted: require('./database/taskDeleted.json'),
    read: require('./database/tasksRead.json')
}

describe('Unit tests', () => {
    let sandbox;
    let service;

    beforeAll(() => {
        service = new Service();
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore();
    })

    describe("createTask", () => {
        test('Should be able to create a task', async () => {
            const createdSuccessJson = database.created
            sandbox.stub(
                service.repository,
                service.repository.createTask.name
            ).returns(createdSuccessJson)

            sandbox.stub(
                service.repository,
                service.repository.getTaskByName.name
            ).returns(null)

            const taskName = mocks.validTaskCreate.name;

            const result = await service.createTask(taskName)
            expect(result).toBe(createdSuccessJson)
            expect(result.task.name).toBe(createdSuccessJson.task.name)
        })

        test('Should not be able to create a task with the same name', async () => {
            sandbox.stub(
                service.repository,
                service.repository.getTaskByName.name
            ).returns([])

            const taskName = mocks.validTaskCreate.name;

            await expect(
                service.createTask(taskName)
            ).rejects.toEqual(new ConflictError(`A task with name ${taskName} already exists`))
        })

        test('Should not be able to create a task with length more than 20 characters', async () => {
            const invalidTaskName = mocks.invalidTaskCreateLength.name
            await expect(
                service.createTask(invalidTaskName)
            ).rejects.toEqual(new BadRequestError('name exceeded max length.'))
        })
    })

    describe('Update Task Service', () => {
        test('Should update a task', async () => {
            const updatedSuccessJson = database.updated
            sandbox.stub(
                service.repository,
                service.repository.updateTask.name
            ).returns(updatedSuccessJson)

            sandbox.stub(
                service.repository,
                service.repository.getTask.name
            ).returns([])

            const result = await service.updateTask(updatedSuccessJson.task._id, {
                name: updatedSuccessJson.task.name,
                completed: updatedSuccessJson.task.completed
            })

            expect(result).toBe(updatedSuccessJson)
        })

        test('Should not update a task that does not exists', async () => {
            const updateFailJsonBody = mocks.validTaskUpdate
            const id = database.created.task._id

            sandbox.stub(
                service.repository,
                service.repository.getTask.name
            ).returns(null)

            await expect(
                service.updateTask(id, updateFailJsonBody)
            ).rejects.toEqual(new NotFoundError('Task not founded'))
        })

        test('Should not update a task with length more than 20 characters', async () => {
            const updateFailJsonBody = mocks.invalidTaskCreateLength
            const id = database.created.task._id

            await expect(
                service.updateTask(id, updateFailJsonBody)
            ).rejects.toEqual(new BadRequestError('name exceeded max length.'))
        })
    })

    describe('Delete Task Service', () => {
        test('Should be able to delete a task', async () => {
            const id = database.deleted.id;
            sandbox.stub(
                service.repository,
                service.repository.deleteTask.name
            ).returns(database.deleted)

            const result = await service.deleteTask(id)

            expect(result).toBe(database.deleted)
        })

        test('Should not be able to delete a task with an invalid id', async () => {
            const id = database.deleted.id;
            sandbox.stub(
                service.repository,
                service.repository.deleteTask.name
            ).returns(null)

            await expect(
                service.deleteTask(id)
            ).rejects.toEqual(new NotFoundError('Task not founded'))
        })

        describe('Read Task Service', () => {
            test('Should get all tasks', async() => {
                const taskRead = database.read
                sandbox.stub(
                    service.repository,
                    service.repository.getAllTasks.name
                ).returns(taskRead)

                const result = await service.getTasks()
                expect(result).toBe(taskRead)
            })
        })
    })    
})
