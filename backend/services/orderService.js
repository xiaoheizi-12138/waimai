const orderDao = require('../dao/orderDao');
const dishDao = require('../dao/dishDao');
const userDao = require('../dao/userDao');
const subscribeService = require('./subscribeService');

const create = async (userId, orderData) => {
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error('订单项不能为空');
  }
  
  let totalAmount = 0;
  const orderItems = [];
  
  for (const item of orderData.items) {
    if (!item.dishId || !item.quantity || item.quantity <= 0) {
      throw new Error('订单项数据不完整');
    }
    
    const dish = await dishDao.findById(item.dishId);
    if (!dish) {
      throw new Error(`菜品ID ${item.dishId} 不存在`);
    }
    
    if (!dish.is_published) {
      throw new Error(`菜品 ${dish.name} 未发布，不能下单`);
    }
    
    const itemTotal = parseFloat(dish.price) * item.quantity;
    totalAmount += itemTotal;
    
    orderItems.push({
      dishId: dish.id,
      dishName: dish.name,
      price: parseFloat(dish.price),
      quantity: item.quantity,
      remark: item.remark
    });
  }
  
  totalAmount = Math.round(totalAmount * 100) / 100;
  
  const order = await orderDao.create({
    userId,
    totalAmount,
    remark: orderData.remark
  }, orderItems);
  
  // 通知管理员有新订单
  try {
    const admins = await userDao.findAllAdmins();
    const orderTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    
    console.log(`准备通知 ${admins.length} 个管理员，订单号: ${order.order_no}`);
    
    for (const admin of admins) {
      console.log(`通知管理员: ${admin.openid}`);
      await subscribeService.notifyAdminNewOrder(
        admin.openid,
        order.order_no,
        orderTime,
        totalAmount,
        orderItems
      );
    }
  } catch (error) {
    console.error('❌ 通知管理员失败:', error.message);
    // 不影响订单创建，仅记录错误
  }
  
  return order;
};

const getById = async (id) => {
  const order = await orderDao.findById(id);
  if (!order) {
    throw new Error('订单不存在');
  }
  return order;
};

const getUserOrders = async (userId, options = {}) => {
  return await orderDao.findByUserId(userId, options);
};

const getAllOrders = async (options = {}) => {
  return await orderDao.findAll(options);
};

const updateStatus = async (id, status) => {
  if (![0, 1, 2, 3].includes(status)) {
    throw new Error('订单状态无效');
  }
  
  const order = await orderDao.findById(id);
  if (!order) {
    throw new Error('订单不存在');
  }
  
  const updatedOrder = await orderDao.updateStatus(id, status);
  
  // 通知用户订单状态变更
  try {
    const user = await userDao.findById(order.user_id);
    const handleTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    
    console.log(`准备通知用户: ${user.openid}, 订单号: ${order.order_no}, 状态: ${status}`);
    
    await subscribeService.notifyUserOrderStatus(
      user.openid,
      order.order_no,
      status,
      handleTime,
      order.remark
    );
  } catch (error) {
    console.error('❌ 通知用户失败:', error.message);
    // 不影响订单状态更新，仅记录错误
  }
  
  return updatedOrder;
};

module.exports = {
  create,
  getById,
  getUserOrders,
  getAllOrders,
  updateStatus
};
