const categoryDao = require('../dao/categoryDao');

const getPublishedCategories = async () => {
  const allCategories = await categoryDao.findAll();
  return allCategories;
};

module.exports = {
  getPublishedCategories
};
