const dishDao = require('../dao/dishDao');

const getPublishedDishes = async (categoryId = null) => {
  const options = {
    isPublished: true
  };
  
  if (categoryId) {
    options.categoryId = categoryId;
  }
  
  const dishes = await dishDao.findAll(options);
  
  return dishes.map(dish => ({
    id: dish.id,
    name: dish.name,
    price: parseFloat(dish.price),
    categoryId: dish.category_id,
    imageUrl: dish.image_url,
    description: dish.description,
    isPublished: dish.is_published
  }));
};

const getDishById = async (id) => {
  const dish = await dishDao.findById(id);
  
  if (!dish) {
    throw new Error('菜品不存在');
  }
  
  if (!dish.is_published) {
    throw new Error('菜品未发布');
  }
  
  return {
    id: dish.id,
    name: dish.name,
    price: parseFloat(dish.price),
    categoryId: dish.category_id,
    imageUrl: dish.image_url,
    description: dish.description,
    isPublished: dish.is_published
  };
};

module.exports = {
  getPublishedDishes,
  getDishById
};
