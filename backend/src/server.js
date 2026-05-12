const app = require('./app');
const config = require('../config');

const PORT = config.port;

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
