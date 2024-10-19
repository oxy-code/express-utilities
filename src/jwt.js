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
   * Express Middleware to authenticate a route
   * with jwt token from request header
   * @param {*} err 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   */
  authenticate: function(err, req, res, next) {
    if (err) {
      next(err);
    }
    else if (!req.headers.authorization) {
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
      req.user = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
      next();
    }
  }
};
