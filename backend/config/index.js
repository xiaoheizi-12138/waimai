require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  database: {
    host: "yamabiko.proxy.rlwy.net",
    port: 45291,
    user: "root",
    password: "ObqUkXoRnFXyVhfHtXSSefqvZBcZsykJ",
    database: "diancan_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  wx: {
    appid: process.env.WX_APPID || '',
    secret: process.env.WX_SECRET || '',
    templateNewOrder: process.env.WX_TEMPLATE_NEW_ORDER || '',
    templateOrderStatus: process.env.WX_TEMPLATE_ORDER_STATUS || ''
  }
};
