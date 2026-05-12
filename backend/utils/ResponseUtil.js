class ResponseUtil {
  static success(data = null, message = '操作成功') {
    return {
      code: 200,
      message: message,
      data: data
    };
  }

  static error(code = 500, message = '服务器内部错误', data = null) {
    return {
      code: code,
      message: message,
      data: data
    };
  }

  static paramError(message = '参数错误') {
    return this.error(400, message);
  }

  static unauthorized(message = '未授权，请先登录') {
    return this.error(401, message);
  }

  static forbidden(message = '无权限访问') {
    return this.error(403, message);
  }

  static notFound(message = '资源不存在') {
    return this.error(404, message);
  }

  static conflict(message = '资源冲突') {
    return this.error(409, message);
  }

  static serverError(message = '服务器内部错误') {
    return this.error(500, message);
  }
}

module.exports = ResponseUtil;
