const axios = require('axios');
const config = require('../config')

class Request {
    constructor(){
        this.service = axios.create({
            baseURL: config.urls.baseUrl,
            validateStatus: false
        })
    }

    async get(resource) {
        return await this.service.get(resource)
    }

    async post(resource, data){
        return await this.service.post(
            resource,
            data,
        )
    }

    async put(resource, data) {
        return await this.service.put(
            resource,
            data
        )
    }
    
    async delete(resource){
        return await this.service.delete(resource)
    }
}

module.exports = Request;