const axios = require('axios');
const config = require('../config');

const getOpenidByCode = async (code) => {
  console.log('========== wechat.js 配置检查 ==========');
  console.log('config:', config);
  console.log('config.wechat:', config.wechat);
  console.log('=======================================');
  
  const { appid, secret } = config.wechat || {};
  
  if (!appid || !secret) {
    throw new Error('微信小程序配置缺失：WX_APPID 或 WX_SECRET');
  }
  
  console.log('使用配置:');
  console.log('appid:', appid);
  console.log('secret:', secret.substring(0, 10) + '...');
  
  const url = `https://api.weixin.qq.com/sns/jscode2session`;
  const params = {
    appid: appid,
    secret: secret,
    js_code: code,
    grant_type: 'authorization_code'
  };
  
  console.log('请求微信API:', url);
  console.log('参数:', { ...params, secret: '***' });
  
  try {
    const response = await axios.get(url, { params });
    console.log('微信API响应:', response.data);
    
    const { openid, session_key, errcode, errmsg } = response.data;
    
    if (errcode) {
      console.error('❌ 微信登录失败:', errcode, errmsg);
      throw new Error(`微信登录失败：${errmsg || 'code无效'}`);
    }
    
    console.log('✅ 成功获取openid:', openid);
    
    return {
      openid,
      sessionKey: session_key
    };
  } catch (error) {
    console.error('❌ 调用微信API失败:', error.message);
    throw new Error('微信登录失败，请稍后重试');
  }
};

module.exports = {
  getOpenidByCode
};
