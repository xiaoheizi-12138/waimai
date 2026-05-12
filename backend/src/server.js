require('dotenv').config();

// 数据库相关代码已注释，使用 database.js 硬编码连接
// process.env.DB_HOST = "yamabiko.proxy.rlwy.net";
// process.env.DB_PORT = "45291";
// process.env.DB_USER = "root";
// process.env.DB_PASSWORD = "ObqUkXoRnFXyVhfHtXSSefqvZBcZsykJ";
// process.env.DB_NAME = "diancan_db";

const app = require('./app');
const config = require('../config');

// 关键修复：强制读取 Railway 的 PORT 环境变量
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`服务启动成功！`);
  console.log(`环境: ${config.env}`);
  console.log(`端口: ${PORT}`);
  console.log(`访问: http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log('=================================');
});

process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});
