const ResponseUtil = require('../utils/ResponseUtil');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const path = require('path');
const fs = require('fs');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('请选择要上传的图片', 400);
  }
  
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const imageUrl = `${baseUrl}/images/${req.file.filename}`;
  
  res.json(ResponseUtil.success({
    imageUrl,
    filename: req.file.filename
  }, '图片上传成功'));
});

const deleteImage = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  const imagePath = path.join(__dirname, '../../public/images', filename);
  
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    res.json(ResponseUtil.success(null, '图片删除成功'));
  } else {
    throw new AppError('图片不存在', 404);
  }
});

module.exports = {
  uploadImage,
  deleteImage
};
