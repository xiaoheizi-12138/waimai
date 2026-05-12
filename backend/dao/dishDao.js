const db = require('../config/database');

const findAll = async (options = {}) => {
  let sql = 'SELECT * FROM dishes WHERE 1=1';
  const params = [];
  
  if (options.categoryId !== undefined) {
    sql += ' AND category_id = ?';
    params.push(options.categoryId);
  }
  
  if (options.isPublished !== undefined) {
    sql += ' AND is_published = ?';
    params.push(options.isPublished);
  }
  
  sql += ' ORDER BY id DESC';
  
  return await db.query(sql, params);
};

const findById = async (id) => {
  const sql = 'SELECT * FROM dishes WHERE id = ?';
  return await db.getOne(sql, [id]);
};

const create = async (dishData) => {
  const sql = `INSERT INTO dishes (name, price, category_id, image_url, description, is_published) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    dishData.name,
    dishData.price,
    dishData.categoryId || null,
    dishData.imageUrl || null,
    dishData.description || null,
    dishData.isPublished || false
  ];
  const insertId = await db.insert(sql, params);
  return await findById(insertId);
};

const update = async (id, dishData) => {
  const fields = [];
  const params = [];
  
  if (dishData.name !== undefined) {
    fields.push('name = ?');
    params.push(dishData.name);
  }
  if (dishData.price !== undefined) {
    fields.push('price = ?');
    params.push(dishData.price);
  }
  if (dishData.categoryId !== undefined) {
    fields.push('category_id = ?');
    params.push(dishData.categoryId);
  }
  if (dishData.imageUrl !== undefined) {
    fields.push('image_url = ?');
    params.push(dishData.imageUrl);
  }
  if (dishData.description !== undefined) {
    fields.push('description = ?');
    params.push(dishData.description);
  }
  if (dishData.isPublished !== undefined) {
    fields.push('is_published = ?');
    params.push(dishData.isPublished);
  }
  
  if (fields.length === 0) {
    return await findById(id);
  }
  
  params.push(id);
  const sql = `UPDATE dishes SET ${fields.join(', ')} WHERE id = ?`;
  await db.update(sql, params);
  return await findById(id);
};

const remove = async (id) => {
  const sql = 'DELETE FROM dishes WHERE id = ?';
  return await db.remove(sql, [id]);
};

const updatePublishStatus = async (id, isPublished) => {
  const sql = 'UPDATE dishes SET is_published = ? WHERE id = ?';
  await db.update(sql, [isPublished, id]);
  return await findById(id);
};

const batchUpdatePublishStatus = async (dishIds, isPublished) => {
  if (!Array.isArray(dishIds) || dishIds.length === 0) {
    return 0;
  }
  
  const placeholders = dishIds.map(() => '?').join(',');
  const sql = `UPDATE dishes SET is_published = ? WHERE id IN (${placeholders})`;
  const params = [isPublished, ...dishIds];
  return await db.update(sql, params);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  updatePublishStatus,
  batchUpdatePublishStatus
};
