require('express-async-errors');
const config = require('./config');

const tasks = require('./routes/tasks');
const { connectDB } = require('./db/connect');

const express = require('express');
const app = express();

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.static('./public'));
app.use(express.json());

// routes
app.use('/api/v1', tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);

app.disable('x-powered-by')

const port = config.ports.serverPort || 5000;

const start = async () => {
  try {
    await connectDB(config.database.mongoUri);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
