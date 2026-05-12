const db = require('../config/database');

const findAll = async () => {
  const sql = 'SELECT * FROM categories ORDER BY sort_order DESC, id ASC';
  return await db.query(sql);
};

const findById = async (id) => {
  const sql = 'SELECT * FROM categories WHERE id = ?';
  return await db.getOne(sql, [id]);
};

const create = async (categoryData) => {
  const sql = 'INSERT INTO categories (name, sort_order) VALUES (?, ?)';
  const params = [
    categoryData.name,
    categoryData.sortOrder || 0
  ];
  const insertId = await db.insert(sql, params);
  return await findById(insertId);
};

const update = async (id, categoryData) => {
  const fields = [];
  const params = [];
  
  if (categoryData.name !== undefined) {
    fields.push('name = ?');
    params.push(categoryData.name);
  }
  if (categoryData.sortOrder !== undefined) {
    fields.push('sort_order = ?');
    params.push(categoryData.sortOrder);
  }
  
  if (fields.length === 0) {
    return await findById(id);
  }
  
  params.push(id);
  const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
  await db.update(sql, params);
  return await findById(id);
};

const remove = async (id) => {
  const sql = 'DELETE FROM categories WHERE id = ?';
  return await db.remove(sql, [id]);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
