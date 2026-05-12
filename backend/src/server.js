require("dotenv").config();
const app = require("./app");
const config = require("../config");

// 固定端口 3000
const PORT = 3000;

// 🔥 关键：必须监听 0.0.0.0，否则 Railway 502
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log(`服务启动成功！`);
  console.log(`环境: ${config.env}`);
  console.log(`端口: ${PORT}`);
  console.log(`监听: 0.0.0.0:${PORT}`);
  console.log("=================================");
});

process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未处理的Promise拒绝:", reason);
});
