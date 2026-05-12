const dishService = require('../services/dishService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAll = asyncHandler(async (req, res) => {
  const options = {};
  
  if (req.query.categoryId) {
    options.categoryId = req.query.categoryId;
  }
  
  if (req.query.isPublished !== undefined) {
    options.isPublished = req.query.isPublished === 'true';
  }
  
  const dishes = await dishService.getAll(options);
  res.json(ResponseUtil.success(dishes, '获取菜品列表成功'));
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dish = await dishService.getById(id);
  res.json(ResponseUtil.success(dish, '获取菜品详情成功'));
});

const create = asyncHandler(async (req, res) => {
  const dish = await dishService.create(req.body);
  res.status(201).json(ResponseUtil.success(dish, '创建菜品成功'));
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dish = await dishService.update(id, req.body);
  res.json(ResponseUtil.success(dish, '更新菜品成功'));
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await dishService.remove(id);
  res.json(ResponseUtil.success(null, '删除菜品成功'));
});

const publishMenu = asyncHandler(async (req, res) => {
  const { dishIds } = req.body;
  const result = await dishService.publishMenu(dishIds);
  res.json(ResponseUtil.success(result, '发布菜单成功'));
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  publishMenu
};
