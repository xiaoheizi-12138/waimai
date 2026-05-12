const authService = require('../services/authService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const wxLogin = asyncHandler(async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    throw new AppError('缺少登录凭证code', 400);
  }
  
  const result = await authService.wxLogin(code);
  
  res.json(ResponseUtil.success(result, '登录成功'));
});

const getUserInfo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  const userInfo = await authService.getUserInfo(userId);
  
  res.json(ResponseUtil.success(userInfo, '获取用户信息成功'));
});

module.exports = {
  wxLogin,
  getUserInfo
};
