const mysql = require('mysql2/promise');
const config = require('../config');

// 硬编码数据库连接，修复崩溃
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

const generateOrderNo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `DC${year}${month}${day}${hour}${minute}${second}${random}`;
};

const create = async (orderData, items) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const orderNo = generateOrderNo();
    
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (order_no, user_id, total_amount, status, remark)
       VALUES (?, ?, ?, 0, ?)`,
      [orderNo, orderData.userId, orderData.totalAmount, orderData.remark || null]
    );
    
    const orderId = orderResult.insertId;
    
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, dish_id, dish_name, price, quantity, remark)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.dishId, item.dishName, item.price, item.quantity, item.remark || null]
      );
    }
    
    await connection.commit();
    
    return await findById(orderId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT o.*, u.nickname, u.avatar_url
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`,
    [id]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  const order = rows[0];
  
  const [items] = await pool.execute(
    `SELECT oi.*, d.image_url
     FROM order_items oi
     LEFT JOIN dishes d ON oi.dish_id = d.id
     WHERE oi.order_id = ?`,
    [id]
  );
  
  order.items = items;
  return order;
};

const findByUserId = async (userId, options = {}) => {
  let sql = `SELECT o.*, u.nickname, u.avatar_url
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE o.user_id = ?`;
  const params = [userId];
  
  if (options.status !== undefined) {
    sql += ` AND o.status = ?`;
    params.push(options.status);
  }
  
  sql += ` ORDER BY o.created_at DESC`;
  
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const findAll = async (options = {}) => {
  let sql = `SELECT o.*, u.nickname, u.avatar_url
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE 1=1`;
  const params = [];
  
  if (options.status !== undefined) {
    sql += ` AND o.status = ?`;
    params.push(options.status);
  }
  
  if (options.startDate) {
    sql += ` AND o.created_at >= ?`;
    params.push(options.startDate);
  }
  
  if (options.endDate) {
    sql += ` AND o.created_at <= ?`;
    params.push(options.endDate);
  }
  
  sql += ` ORDER BY o.created_at DESC`;
  
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const updateStatus = async (id, status) => {
  const [result] = await pool.execute(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, id]
  );
  
  if (result.affectedRows === 0) {
    return null;
  }
  
  return await findById(id);
};

module.exports = {
  create,
  findById,
  findByUserId,
  findAll,
  updateStatus
};
