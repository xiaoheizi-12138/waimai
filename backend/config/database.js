const mysql = require('mysql2/promise');

// 直接写死数据库配置，绕过所有环境变量问题
const pool = mysql.createPool({
  host: "yamabiko.proxy.rlwy.net",
  port: 45291,
  user: "root",
  password: "ObqUkXoRnFXyVhfHtXSSefqvZBcZsykJ",
  database: "diancan_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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
