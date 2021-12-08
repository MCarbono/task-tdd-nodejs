require('dotenv').config();

module.exports = {
    urls: {
        baseUrl: process.env.BASE_URL
    },
    database: {
        mongoUri: process.env.MONGO_URI
    },
    ports: {
        serverPort: process.env.PORT
    }
}