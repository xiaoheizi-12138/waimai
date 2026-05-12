const userDao = require('../dao/userDao');
const wechatUtil = require('../utils/wechat');
const jwtUtil = require('../utils/jwt');

const wxLogin = async (code) => {
  let openid;
  
  console.log('========== 开始微信登录 ==========');
  console.log('code:', code);
  console.log('环境:', process.env.NODE_ENV);
  
  try {
    // 尝试调用微信API获取真实openid
    console.log('调用微信API...');
    const wechatData = await wechatUtil.getOpenidByCode(code);
    openid = wechatData.openid;
    
    console.log('========== 微信API调用成功 ==========');
    console.log('openid:', openid, '（固定不变）');
    console.log('==================================');
  } catch (error) {
    console.error('========== 微信API调用失败 ==========');
    console.error('错误信息:', error.message);
    console.error('错误详情:', error);
    
    // 微信API调用失败（开发环境模拟code无法换取openid）
    if (process.env.NODE_ENV === 'development') {
      // 使用固定的测试openid
      openid = 'dev_test_user_openid_001';
      console.log('========== 开发环境测试登录 ==========');
      console.log('openid:', openid, '（固定测试账号）');
      console.log('提示：真机调试可获取真实openid');
      console.log('=====================================');
    } else {
      // 生产环境，抛出错误
      throw error;
    }
  }
  
  let user = await userDao.findByOpenid(openid);
  
  if (!user) {
    user = await userDao.create({
      openid: openid,
      role: 'user'
    });
    console.log('✅ 新用户创建成功，默认角色：user');
    console.log('💡 如需设置为管理员，请执行SQL:');
    console.log(`   UPDATE users SET role = 'admin' WHERE openid = '${openid}';`);
  } else {
    console.log('✅ 用户已存在，角色:', user.role);
  }
  
  const token = jwtUtil.generateToken({
    userId: user.id,
    openid: user.openid,
    role: user.role
  });
  
  return {
    token,
    userInfo: {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatarUrl: user.avatar_url,
      role: user.role
    }
  };
};

const getUserInfo = async (userId) => {
  const user = await userDao.findById(userId);
  if (!user) {
    throw new Error('用户不存在');
  }
  
  return {
    id: user.id,
    openid: user.openid,
    nickname: user.nickname,
    avatarUrl: user.avatar_url,
    role: user.role,
    createdAt: user.created_at
  };
};

module.exports = {
  wxLogin,
  getUserInfo
};
