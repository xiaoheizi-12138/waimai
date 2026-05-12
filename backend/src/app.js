const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// 允许跨域
app.use(cors());

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态资源
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// 日志
app.use(morgan('dev'));

// ==========================================
// 🔥 强制健康检查（Railway 必须要这个）
// ==========================================
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 首页
app.get('/', (req, res) => {
  res.status(200).json({
    name: '点菜微信小程序API',
    version: '1.0.0',
    status: 'running'
  });
});

// 路由
app.use('/api/v1/auth', require('../routes/auth'));
app.use('/api/v1/admin', require('../routes/admin'));
app.use('/api/v1', require('../routes/menu'));
app.use('/api/v1', require('../routes/index'));
app.use('/api/v1/upload', require('../routes/upload'));
app.use('/api/v1', require('../routes/order'));
app.use('/api/v1/test', require('../routes/test'));

// 错误处理
app.use((req, res) => {
  res.status(404).json({ msg: '接口不存在' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: '服务器错误' });
});

module.exports = app;
