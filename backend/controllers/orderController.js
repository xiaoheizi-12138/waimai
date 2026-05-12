const orderService = require('../services/orderService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const create = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const order = await orderService.create(userId, req.body);
  console.log('创建订单返回:', JSON.stringify(order, null, 2));
  res.json(ResponseUtil.success(order, '订单创建成功'));
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getById(id);
  
  if (req.user.role !== 'admin' && order.user_id !== req.user.userId) {
    throw new AppError('无权查看此订单', 403);
  }
  
  res.json(ResponseUtil.success(order, '获取订单详情成功'));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const options = {};
  
  if (req.query.status !== undefined) {
    options.status = parseInt(req.query.status);
  }
  
  const orders = await orderService.getUserOrders(userId, options);
  res.json(ResponseUtil.success(orders, '获取订单列表成功'));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const options = {};
  
  if (req.query.status !== undefined) {
    options.status = parseInt(req.query.status);
  }
  
  if (req.query.startDate) {
    options.startDate = req.query.startDate;
  }
  
  if (req.query.endDate) {
    options.endDate = req.query.endDate;
  }
  
  const orders = await orderService.getAllOrders(options);
  res.json(ResponseUtil.success(orders, '获取订单列表成功'));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log('更新订单状态:', { id, status, body: req.body });
  
  const order = await orderService.updateStatus(id, status);
  res.json(ResponseUtil.success(order, '订单状态更新成功'));
});

module.exports = {
  create,
  getById,
  getUserOrders,
  getAllOrders,
  updateStatus
};
