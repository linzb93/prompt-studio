# 技术栈

本项目是一个用 Electron 开发的 app，渲染进程用的是 Vue3 + element plus。

# 其他要求

本项目用 TypeScript 编写，所有变量、属性和函数的参数，都需要使用 TypeScript 进行类型标注。所有的依赖都已安装，无需手动安装。

## 主进程

一、 主进程路由
主进程入口文件是 electron/main/index.ts。

Electron 项目通过 ipc 的方式进行通信。在主进程的 electron/main/router.ts，使用 ipcMain.handle 方法管理路由：

```ts
ipcMain.handle('model-get-list', async (evt, data: string) => {
    //
});
```

二、应用数据管理
应用数据都存在本地，调用 electron/main/shared/sql.ts 中的方法进行增删改查。当数据结构有变化时，需要修改文件中的 StoredDataType 方法。
三、调用 ai 模型
通过`openai`这个包来调用 ai 模型，具体使用方法可以参考官方文档。要做成和 ai 应用一样的分段返回 ai 生成的结果，所以要用`event.webContents.send`这个方法来分段返回,event 是一个 Electron 的事件对象，用于向渲染进程发送消息,在 ipcMain.handle 的回调函数中，第一个参数就是这个 event 对象。

## 渲染进程

一、渲染进程通信
在渲染进程，通过引入 shared/request.ts 文件来发送 ipc 和接收，request 函数封装了 ipcRenderer.invoke 方法，传入两个参数，第一个是路由名称 String 类型，第二个参数是数据，any 类型。

```ts
import { request } from '@/shared/request';
(async () => {
    const res = await request('model-get-list', {
        name: 'test',
    });
    console.log(res);
})();
```

二、渲染进程的路由
渲染进程如果有使用 vue-router，请动态引入路由组件：

```ts
import { createRouter, createWebHashHistory } from 'vue-router';
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/home.vue'),
        },
    ],
});
```

三、解析 Markdown
渲染进程如果有使用 markdown-it 解析 markdown。

```ts
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();
const result = md.render('# Hello World!');
console.log(result);
```
