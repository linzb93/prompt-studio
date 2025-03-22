# 技术栈

本项目是一个用 Electron 开发的 app，渲染进程用的是 Vue3 + element plus。

# 目录结构

## 主进程

.
├── main.ts // 主进程入口文件
├── router.ts // 路由文件
├── modules // 各模块
│ └── model
│ ├── model.controller.ts // 模块的 Controller 类，只能由路由控制器直接调用
│ └── model.service.ts // 模块的 Service 类，可以在各模块的 Service 之间调用，也可以被同个模块的 Controller 调用。
├── shared // 项目的共享函数
│ ├── index.ts
│ └── sql.ts

渲染进程目录结构和 Vue3 项目的一样，就不描述了。

# 其他要求

一、通信方式
Electron 项目通过 ipc 的方式进行通信。在主进程的 router.ts，按照这种方式添加路由：

```ts
import { ModelController } from './modules/model/model.controller';
const model = new ModelController();
ipcMain.handle('model-get-list', async (evt, data: string) => {
    return await model.getList(string);
});
```

在渲染进程，通过引入`shared/request.ts`文件来发送 ipc 和接收，`request`函数封装了`ipcRenderer.invoke`方法，传入两个参数，第一个是路由名称 String 类型，第二个参数是数据，any 类型。

```ts
import request from '@/shared/request';
(async () => {
    const list = await request('model-get-list', {
        pageIndex: 1,
        pageSize: 10,
    });
})();
```

添加接口的名称、传参和返回，请参考 docs 目录下的模块文件。

二、添加界面的时候，参考原型目录下的页面。
