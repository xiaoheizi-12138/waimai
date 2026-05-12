const db = require('../config/database');

const findById = async (id) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  return await db.getOne(sql, [id]);
};

const findByOpenid = async (openid) => {
  const sql = 'SELECT * FROM users WHERE openid = ?';
  return await db.getOne(sql, [openid]);
};

const create = async (userData) => {
  const sql = `INSERT INTO users (openid, nickname, avatar_url, role) 
               VALUES (?, ?, ?, ?)`;
  const params = [
    userData.openid,
    userData.nickname || null,
    userData.avatarUrl || null,
    userData.role || 'user'
  ];
  const insertId = await db.insert(sql, params);
  return await findById(insertId);
};

const update = async (id, userData) => {
  const fields = [];
  const params = [];
  
  if (userData.nickname !== undefined) {
    fields.push('nickname = ?');
    params.push(userData.nickname);
  }
  if (userData.avatarUrl !== undefined) {
    fields.push('avatar_url = ?');
    params.push(userData.avatarUrl);
  }
  if (userData.role !== undefined) {
    fields.push('role = ?');
    params.push(userData.role);
  }
  
  if (fields.length === 0) {
    return await findById(id);
  }
  
  params.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  await db.update(sql, params);
  return await findById(id);
};

const findAllAdmins = async () => {
  const sql = 'SELECT * FROM users WHERE role = ?';
  return await db.query(sql, ['admin']);
};

module.exports = {
  findById,
  findByOpenid,
  create,
  update,
  findAllAdmins
};
