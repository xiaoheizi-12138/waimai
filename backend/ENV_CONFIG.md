# 点菜微信小程序 - 环境变量配置说明

## 文件说明
- `.env.example` - 环境变量模板文件
- `.env` - 实际环境变量文件（需要手动创建，不提交到Git）

## 配置步骤

### 1. 创建 .env 文件
```bash
cd backend
cp .env.example .env
```

### 2. 修改数据库配置
编辑 `.env` 文件，修改以下配置：
```bash
DB_HOST=localhost          # 数据库地址
DB_PORT=3306               # 数据库端口
DB_USER=root               # 数据库用户名
DB_PASSWORD=你的MySQL密码   # ⚠️ 必须修改
DB_NAME=diancan_db         # 数据库名称
```

### 3. JWT配置（已自动生成）
```bash
JWT_SECRET=98d87dafbe399efdbc4ca3d7dbeed6d68e3875121884c117cd64a26024fcbe84
JWT_EXPIRES_IN=7d
```
⚠️ **安全提示**：
- 密钥已自动生成，请直接使用
- 生产环境请重新生成新密钥
- 不要将 `.env` 文件提交到Git仓库

### 4. 微信小程序配置
需要前往[微信公众平台](https://mp.weixin.qq.com/)获取：
```bash
WX_APPID=你的小程序AppID
WX_SECRET=你的小程序Secret
```

## 获取微信小程序AppID和Secret

### 步骤：
1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入「开发」->「开发管理」->「开发设置」
3. 复制 `AppID(小程序ID)` 到 `WX_APPID`
4. 复制 `AppSecret(小程序密钥)` 到 `WX_SECRET`
   - 如果没有显示，点击「生成」按钮
   - 需要管理员扫码确认

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| PORT | 后端服务端口 | 3000 |
| NODE_ENV | 运行环境 | development/production |
| DB_HOST | 数据库地址 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户名 | root |
| DB_PASSWORD | 数据库密码 | 123456 |
| DB_NAME | 数据库名称 | diancan_db |
| JWT_SECRET | JWT密钥 | （已生成） |
| JWT_EXPIRES_IN | Token有效期 | 7d |
| WX_APPID | 微信小程序AppID | wx1234567890 |
| WX_SECRET | 微信小程序Secret | abc123... |

## 生产环境配置

生产环境需要额外注意：
1. ✅ 重新生成JWT_SECRET
2. ✅ 使用强密码的数据库用户
3. ✅ 配置HTTPS
4. ✅ 设置NODE_ENV=production
5. ✅ 不要使用root数据库用户

## 验证配置

启动后端服务，检查配置是否正确：
```bash
cd backend
npm install
npm run dev
```

访问 http://localhost:3000/health 检查服务是否正常。
