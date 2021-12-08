const mocks = {
    validTaskGet: require('../mocks/validTaskGet.json'),
    validTaskCreate: require('../mocks/validTaskCreate.json'),
    validTaskCreate2: require('../mocks/validTaskCreate2.json'),
    invalidTaskCreateLength: require('../mocks/invalidTaskCreateLength.json'),
    validTaskUpdate: require('../mocks/validTaskUpdate.json')
}

const { connectDB, disconnectDB } = require('../../db/connect');
const config = require('../../config')
const Request = require('../../utils/Request');

const Task = require('../../models/Task');

let request;
describe('Tests all methods(CRUD) with the database', () => {
    beforeEach(() => {
        request = new Request();
    })

    afterEach(async () => {
        await connectDB(config.database.mongoUri);
        await Task.deleteMany({})
        await disconnectDB()
    })

    describe('Create Task Service', () => {
        test('Should be able to create a task', async () => {
            const response = await request.post('tasks', mocks.validTaskCreate)
            expect(response.status).toBe(201)

            const post = response.data.task;
            expect(post.name).toBe(mocks.validTaskCreate.name)
        })

        test('Should not be able to create a task with the same name', async () => {
            await request.post('tasks', mocks.validTaskCreate)
            const response = await request.post('tasks', mocks.validTaskCreate)

            expect(response.status).toBe(409)
        })

        test('Should not be able to create a task with length more than 20 characters', async () => {
            const response = await request.post('tasks', mocks.invalidTaskCreateLength)
            expect(response.status).toBe(400)
        })
    })

    describe('Update Task Service', () => {
        test('Should update a task', async () => {
            const taskPost = await request.post('tasks', mocks.validTaskCreate);        
            const id = taskPost.data.task._id

            const response = await request.put(`tasks/${id}`, mocks.validTaskUpdate)

            expect(response.data.task.name).toBe(mocks.validTaskUpdate.name)
            expect(response.data.task.completed).toBe(mocks.validTaskUpdate.completed)
            expect(response.status).toBe(200)
        })

        test('Should not update a task that does not exists', async () => {
            const response = await request.put(`tasks/619523469d9d742b606cf1ae`, mocks.validTaskUpdate)
            expect(response.status).toBe(404)
        })

        test('Should not update a task with length more than 20 characters', async () => {
            const taskPost = await request.post('tasks', mocks.validTaskCreate);            
            const id = taskPost.data.task._id

            const response = await request.put(`tasks/${id}`, mocks.invalidTaskCreateLength)
            expect(response.status).toBe(400)
        })
    })

    describe('Delete Task Service', () => {
        test('Should be able to delete a task', async () => {
            const createTask = await request.post(`tasks`, mocks.validTaskCreate)
            const id = createTask.data.task._id

            const response = await request.delete(`tasks/${id}`)
            expect(response.status).toBe(204)

            const getTask = await request.get(`tasks/${id}`)
            expect(getTask.data.task).toBe(null)
        })

        test('Should not be able to delete a task with an invalid id', async () => {
            const id = '619523469d9d742b606cf1ae';

            const response = await request.delete(`tasks/${id}`)
            expect(response.status).toBe(404)
        })
    })    

    describe('Read Task Service', () => {
        test('Should get all tasks', async() => {
            await request.post(`tasks`, mocks.validTaskCreate)
            await request.post(`tasks`, mocks.validTaskCreate2)

            const response = await request.get('tasks')

            expect(response.status).toBe(200)
            expect(response.data.tasks).toHaveLength(2)
        })
    })
})