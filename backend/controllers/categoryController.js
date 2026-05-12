const categoryService = require('../services/categoryService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  res.json(ResponseUtil.success(categories, '获取分类列表成功'));
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.getById(id);
  res.json(ResponseUtil.success(category, '获取分类详情成功'));
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  res.status(201).json(ResponseUtil.success(category, '创建分类成功'));
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.update(id, req.body);
  res.json(ResponseUtil.success(category, '更新分类成功'));
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await categoryService.remove(id);
  res.json(ResponseUtil.success(null, '删除分类成功'));
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
