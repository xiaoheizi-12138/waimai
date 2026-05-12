const categoryDao = require('../dao/categoryDao');

const getAll = async () => {
  return await categoryDao.findAll();
};

const getById = async (id) => {
  const category = await categoryDao.findById(id);
  if (!category) {
    throw new Error('分类不存在');
  }
  return category;
};

const create = async (categoryData) => {
  if (!categoryData.name || categoryData.name.trim() === '') {
    throw new Error('分类名称不能为空');
  }
  
  return await categoryDao.create({
    name: categoryData.name.trim(),
    sortOrder: categoryData.sortOrder || 0
  });
};

const update = async (id, categoryData) => {
  const existing = await categoryDao.findById(id);
  if (!existing) {
    throw new Error('分类不存在');
  }
  
  if (categoryData.name !== undefined && categoryData.name.trim() === '') {
    throw new Error('分类名称不能为空');
  }
  
  return await categoryDao.update(id, {
    name: categoryData.name?.trim(),
    sortOrder: categoryData.sortOrder
  });
};

const remove = async (id) => {
  const existing = await categoryDao.findById(id);
  if (!existing) {
    throw new Error('分类不存在');
  }
  
  return await categoryDao.remove(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
