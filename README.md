### 功能点
- 解析 nvidia-smi的内容 并且展示出来
- 解析完毕的内容 通过websocket发送到网页端

### 创建简单的客户端内容
- 需求，有哪些属性是需要的可以被列出来的
- 需要添加帧数限制，可能由于wallpaper engine导致的过度渲染的问题 wallpaper内的渲染速度限制好像不起作用了 导致渲染会以最高帧数的渲染为标准
- [x] 添加背景
- [x] 设置帧数限制

### 使用方式
1. nodejs启动server文件夹下面的server.js
2. 开发者模式
```
npm run dev
```
3. 打开localhost:8081 