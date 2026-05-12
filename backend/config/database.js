const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool(config.database);

const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const getOne = async (sql, params = []) => {
  const rows = await query(sql, params);
  return rows[0] || null;
};

const insert = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return result.insertId;
};

const update = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
};

const remove = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
};

const transaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  query,
  getOne,
  insert,
  update,
  remove,
  transaction,
  pool,
  getConnection: () => pool.getConnection(),
  execute: (sql, params) => pool.execute(sql, params)
};
