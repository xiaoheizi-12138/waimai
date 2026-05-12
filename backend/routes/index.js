const express = require('express');
const router = express.Router();
const ResponseUtil = require('../utils/ResponseUtil');

router.get('/user/info', (req, res) => {
  res.json(ResponseUtil.success(null, '获取用户信息成功'));
});

module.exports = router;
