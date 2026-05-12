const dishDao = require('../dao/dishDao');
const path = require('path');
const fs = require('fs');

const getAll = async (options = {}) => {
  return await dishDao.findAll(options);
};

const getById = async (id) => {
  const dish = await dishDao.findById(id);
  if (!dish) {
    throw new Error('菜品不存在');
  }
  return dish;
};

const create = async (dishData) => {
  if (!dishData.name || dishData.name.trim() === '') {
    throw new Error('菜品名称不能为空');
  }
  
  if (dishData.price === undefined || dishData.price === null) {
    throw new Error('菜品价格不能为空');
  }
  
  if (isNaN(dishData.price) || dishData.price < 0) {
    throw new Error('菜品价格必须为非负数');
  }
  
  return await dishDao.create({
    name: dishData.name.trim(),
    price: parseFloat(dishData.price),
    categoryId: dishData.categoryId,
    imageUrl: dishData.imageUrl,
    description: dishData.description,
    isPublished: dishData.isPublished || false
  });
};

const update = async (id, dishData) => {
  const existing = await dishDao.findById(id);
  if (!existing) {
    throw new Error('菜品不存在');
  }
  
  if (dishData.name !== undefined && dishData.name.trim() === '') {
    throw new Error('菜品名称不能为空');
  }
  
  if (dishData.price !== undefined) {
    if (isNaN(dishData.price) || dishData.price < 0) {
      throw new Error('菜品价格必须为非负数');
    }
    dishData.price = parseFloat(dishData.price);
  }
  
  return await dishDao.update(id, dishData);
};

const remove = async (id) => {
  const existing = await dishDao.findById(id);
  if (!existing) {
    throw new Error('菜品不存在');
  }
  
  if (existing.imageUrl) {
    const defaultImage = '/images/红烧肉.png';
    if (!existing.imageUrl.includes(defaultImage)) {
      const matches = existing.imageUrl.match(/\/images\/([^\/]+)$/);
      if (matches) {
        const filename = matches[1];
        const imagePath = path.join(__dirname, '../public/images', filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
  }
  
  return await dishDao.remove(id);
};

const publishMenu = async (dishIds) => {
  if (!Array.isArray(dishIds)) {
    throw new Error('dishIds必须为数组');
  }
  
  await dishDao.batchUpdatePublishStatus(null, false);
  
  if (dishIds.length > 0) {
    await dishDao.batchUpdatePublishStatus(dishIds, true);
  }
  
  return { success: true };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  publishMenu
};
