const categoryService = require('../services/categoryService');
const menuService = require('../services/menuService');
const dishPublicService = require('../services/dishPublicService');
const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler } = require('../middleware/errorHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await menuService.getPublishedCategories();
  res.json(ResponseUtil.success(categories, '获取分类列表成功'));
});

const getDishes = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  const dishes = await dishPublicService.getPublishedDishes(categoryId);
  res.json(ResponseUtil.success(dishes, '获取菜品列表成功'));
});

const getDishById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dish = await dishPublicService.getDishById(id);
  res.json(ResponseUtil.success(dish, '获取菜品详情成功'));
});

module.exports = {
  getCategories,
  getDishes,
  getDishById
};
