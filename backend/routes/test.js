const express = require('express');
const router = express.Router();
const subscribeService = require('../services/subscribeService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/test/subscribe', asyncHandler(async (req, res) => {
  const { touser, templateType, data } = req.body;
  
  console.log('测试订阅消息:', { touser, templateType, data });
  
  let result;
  
  if (templateType === 'newOrder') {
    result = await subscribeService.notifyAdminNewOrder(
      touser,
      data.orderNo || 'TEST001',
      data.orderTime || new Date().toLocaleString('zh-CN'),
      data.amount || '100.00',
      data.items || [{ dishName: '测试菜品', quantity: 1 }]
    );
  } else if (templateType === 'orderStatus') {
    result = await subscribeService.notifyUserOrderStatus(
      touser,
      data.orderNo || 'TEST001',
      data.status || 1,
      data.handleTime || new Date().toLocaleString('zh-CN'),
      data.remark || '测试备注'
    );
  } else {
    throw new Error('不支持的模板类型');
  }
  
  res.json(ResponseUtil.success(result, '测试订阅消息发送成功'));
}));

module.exports = router;
