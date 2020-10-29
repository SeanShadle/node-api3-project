const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const server = express();
const userRouter = require('./users/userRouter')

server.use(express.json());
server.use(logger);
server.use(helmet());
server.use("/api/users", userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
    );
    next();
  }
  
  server.use((error, req, res, next) => {
    res.status(error.code).json(error);
  });
  

module.exports = server;
