const ResponseUtil = require('../utils/ResponseUtil');

const errorHandler = (err, req, res, next) => {
  console.error('错误信息:', err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(ResponseUtil.unauthorized('Token无效或已过期'));
  }
  
  if (err.name === 'SyntaxError') {
    return res.status(400).json(ResponseUtil.paramError('JSON格式错误'));
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(statusCode).json(ResponseUtil.error(statusCode, message));
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json(ResponseUtil.notFound(`路由 ${req.method} ${req.path} 不存在`));
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError
};
