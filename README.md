# Chatty 聊天室應用程式

Chatty 是一個使用 React 與 NestJS 打造的即時聊天室應用，支援多位使用者線上通訊與狀態互動，採用前後端分離架構，透過 WebSocket 實現即時訊息推播與更新。

### 技術架構

前端：
React
TypeScript
Vite
Tailwind CSS
Socket.IO Client

後端：
NestJS
TypeScript
Socket.IO
RESTful API
MongoDB Atlas（透過 Mongoose）

開發工具與基礎設施：
Docker / Docker Compose
Nginx（作為反向代理）
.env 環境變數管理
安裝與執行

### 前置需求
Node.js v18+ <br>
Docker + Docker Compose <br>
Yarn 或 npm

<hr>

### 1. 下載專案
```
git clone https://github.com/andreahsu1030/chatty_fullstack.git
cd chatty_fullstack
```
### 2. 設定環境變數
後端 .env（位於 chatty_backend/）：
```
MONGO_USERNAME=mongodb_username
MONGO_PASSWORD=mongodb_password
MONGO_CLUSTER=cluster0.wqndp.mongodb.net

JWT_SECRET=jwt_key
BASE_URL=http://localhost:3000/
```
前端 .env（位於 chatty_client/）：
```
VITE_API_URL=http://localhost:3000
```
### 3. 使用 Docker Compose 啟動
```
docker-compose up -d
```

啟動後：
前端將運行於 http://localhost:4000
後端 API 位於 http://localhost:3000

### 專案結構
```
chatty_fullstack/
├── chatty_client/     # React 前端
├── chatty_backend/    # NestJS 後端
├── docker-compose.yml
└── README.md
```


### 前端（開發模式）
```
cd chatty_client
npm install
npm run dev
```

### 後端（開發模式）
```
cd chatty_backend
npm install
npm run start:dev
```

## 已完成功能
- 使用者註冊 / 登入
- 上傳使用者大頭貼
- 即時訊息傳送（WebSocket）
- 資料儲存於 MongoDB

## 計畫功能
- 群組聊天室
- 使用者上線狀態顯示
- 未讀訊息提醒
- 推播


作者 Andrea Hsu
如有建議或問題，歡迎 issue
