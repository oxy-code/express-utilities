const logger = require('./logger');
const jwt = require('jsonwebtoken');

module.exports = {
  /**
   * It is a generic function to,
   * Generates JWT token for authentication
   * @param {*} data 
   * @param {*} options 
   * @returns 
   */
  generateToken: function(data, options) {
    return jwt.sign(data, process.env.JWT_SECRET, options);
  },
  /**
   * authGuard - Express Middleware
   * Used to authenticate a route
   * with jwt token from request header
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  authGuard: function(req, res, next) {
    if (!req.headers.authorization) {
      const meta = {
        reqTrackingId: res.get('reqTrackingId'),
        payload: req.body || req.query,
        path: req.originalUrl,
        hostname: req.hostname
      };
      logger.error('Unauthorized request', meta);
      return res.status(403).json({
        message: 'Unauthorized request',
        details: 'Missing authorization header & bearer token'
      });
    }
    else {
      req.user = jwt.verify(req.headers.authorization.replace('Bearer ', ''), process.env.JWT_SECRET);
      next();
    }
  }
};
