const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, request.body);
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token is missing or invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization');
  const token =
    auth && auth.startsWith('Bearer ') ? auth.replace('Bearer ', '') : null;
  request.token = token;
  next();
};

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken) {
    return response.status(401).json({ error: 'token is missing or invalid' });
  }
  request.user = decodedToken;
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
