const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const apiServices = require('../services/apiServices');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createError(401, 'Authentication token is required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.APP_KEY);
    if (!decoded || !decoded.username) {
      throw createError(401, 'Invalid token');
    }
    // Get user from database
    const user = await apiServices.getUser({ username: decoded.username });
    if (!user) {
      throw createError(401, 'User not found');
    }
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle JWT specific errors
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired'));
    }
    next(error);
  }
};

module.exports = { auth };