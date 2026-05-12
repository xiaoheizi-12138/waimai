const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('../config');
const { errorHandler, notFoundHandler } = require('../middleware/errorHandler');
const ResponseUtil = require('../utils/ResponseUtil');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json(ResponseUtil.success({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.env
  }, '服务运行正常'));
});

app.get('/', (req, res) => {
  res.json(ResponseUtil.success({
    name: '点菜微信小程序API',
    version: '1.0.0',
    description: 'RESTful API服务'
  }));
});

app.use('/api/v1/auth', require('../routes/auth'));
app.use('/api/v1/admin', require('../routes/admin'));
app.use('/api/v1', require('../routes/menu'));
app.use('/api/v1', require('../routes/index'));
app.use('/api/v1/upload', require('../routes/upload'));
app.use('/api/v1', require('../routes/order'));
app.use('/api/v1/test', require('../routes/test'));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
