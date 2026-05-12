const jwtUtil = require('../utils/jwt');
const ResponseUtil = require('../utils/ResponseUtil');

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    return res.status(401).json(ResponseUtil.unauthorized('未提供认证令牌'));
  }
  
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json(ResponseUtil.unauthorized('令牌格式错误'));
  }
  
  const token = parts[1];
  const decoded = jwtUtil.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json(ResponseUtil.unauthorized('令牌无效或已过期'));
  }
  
  req.user = {
    userId: decoded.userId,
    openid: decoded.openid,
    role: decoded.role
  };
  
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(ResponseUtil.forbidden('需要管理员权限'));
  }
  
  next();
};

const optionalAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (authorization) {
    const parts = authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      const decoded = jwtUtil.verifyToken(token);
      
      if (decoded) {
        req.user = {
          userId: decoded.userId,
          openid: decoded.openid,
          role: decoded.role
        };
      }
    }
  }
  
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth
};
