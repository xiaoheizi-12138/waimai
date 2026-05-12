require('dotenv').config();
const app = require('./app');

// 关键：强制读取 Railway 提供的 PORT，不依赖 config 文件
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`服务启动成功！`);
  console.log(`端口: ${PORT}`);
  console.log(`健康检查地址: http://localhost:${PORT}/health`);
  console.log('=================================');
});

process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});
