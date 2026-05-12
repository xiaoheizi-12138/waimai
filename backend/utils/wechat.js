const axios = require('axios');

const getOpenidByCode = async (code) => {
  // ==============================================
  // 🔥 直接从环境变量读取，但强制保留原始大小写
  // ==============================================
  const appid = "wxec4baaea03765bd5"; // 固定正确值
  const secret = process.env.WX_SECRET; // 密钥你自己填在 Railway 里

  console.log('========== wechat.js 配置检查 ==========');
  console.log('appid:', appid);
  console.log('secret:', secret ? secret.substring(0, 10) + '...' : '未配置');
  console.log('=======================================');

  if (!appid || !secret) {
    throw new Error('微信小程序配置缺失：WX_APPID 或 WX_SECRET');
  }

  const url = `https://api.weixin.qq.com/sns/jscode2session`;
  const params = {
    appid: appid,
    secret: secret,
    js_code: code,
    grant_type: 'authorization_code'
  };

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
