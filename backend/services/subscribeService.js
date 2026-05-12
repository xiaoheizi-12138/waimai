const axios = require('axios');
const config = require('../config');

const getAccessToken = async () => {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appid}&secret=${config.wx.secret}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.errcode) {
      throw new Error(`获取access_token失败: ${response.data.errmsg}`);
    }
    return response.data.access_token;
  } catch (error) {
    console.error('获取access_token错误:', error.message);
    throw error;
  }
};

const sendSubscribeMessage = async (touser, template_id, page, data) => {
  try {
    const accessToken = await getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;
    
    const requestData = {
      touser,
      template_id,
      page,
      data,
      miniprogram_state: 'developer',
      lang: 'zh_CN'
    };
    
    console.log('发送订阅消息:', JSON.stringify(requestData, null, 2));
    
    const response = await axios.post(url, requestData);
    
    console.log('订阅消息响应:', JSON.stringify(response.data, null, 2));
    
    if (response.data.errcode !== 0) {
      console.error('发送订阅消息失败:', response.data);
      
      // 43101: 用户拒绝接收消息
      // 47003: 模板参数不准确
      if (response.data.errcode === 43101) {
        console.warn('用户拒绝接收消息，需要在微信中重新授权');
      }
      
      throw new Error(`发送订阅消息失败: ${response.data.errmsg}`);
    }
    
    console.log('✅ 订阅消息发送成功');
    return response.data;
  } catch (error) {
    console.error('❌ 发送订阅消息错误:', error.message);
    throw error;
  }
};

const notifyAdminNewOrder = async (adminOpenid, orderNo, orderTime, totalAmount, orderItems) => {
  const templateId = config.wx.templateNewOrder;
  
  if (!templateId || templateId === 'your_new_order_template_id') {
    console.warn('未配置新订单通知模板ID，跳过通知');
    return;
  }
  
  const orderContent = orderItems.map(item => `${item.dishName} x${item.quantity}`).join(', ');
  
  // 订单受理通知模板关键词：
  // character_string1: 订单号
  // time4: 下单时间
  // thing3: 订单内容
  // amount2: 订单金额
  // thing5: 备注
  const data = {
    character_string1: { value: orderNo },
    time4: { value: orderTime },
    thing3: { value: orderContent.substring(0, 20) },
    amount2: { value: `${totalAmount}元` },
    thing5: { value: '请及时确认订单' }
  };
  
  return await sendSubscribeMessage(adminOpenid, templateId, 'pages/adminOrders/adminOrders', data);
};

const notifyUserOrderStatus = async (userOpenid, orderNo, status, handleTime, remark) => {
  const templateId = config.wx.templateOrderStatus;
  
  if (!templateId || templateId === 'your_order_status_template_id') {
    console.warn('未配置订单状态通知模板ID，跳过通知');
    return;
  }
  
  const statusText = {
    0: '待处理',
    1: '已确认',
    2: '已完成',
    3: '已取消'
  };
  
  // 订单售后通知模板关键词：
  // thing1: 商家名称
  // character_string2: 订单编号
  // thing3: 售后状态
  // thing4: 温馨提示
  const data = {
    thing1: { value: '点菜小程序' },
    character_string2: { value: orderNo },
    thing3: { value: statusText[status] || '未知' },
    thing4: { value: remark || '感谢您的支持' }
  };
  
  return await sendSubscribeMessage(userOpenid, templateId, 'pages/orderList/orderList', data);
};

module.exports = {
  sendSubscribeMessage,
  notifyAdminNewOrder,
  notifyUserOrderStatus
};
