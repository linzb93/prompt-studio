# 技术栈

本项目是一个用 Electron 开发的 app，渲染进程用的是 Vue3 + element plus。

# 目录结构

## 主进程

.
├── main.ts // 主进程入口文件
├── router.ts // 主进程路由
├── modules // 主进程模块
│ └── model // 模块目录
│ ├── model.controller.ts // 模块控制器
│ └── model.service.ts // 模块服务
├── shared // 主进程公用函数目录
│ ├── index.ts
│ └── sql.ts // 本地数据文件读写操作

# 其他要求

## 通用

一、本项目用 TypeScript 编写，所有变量、属性和函数的参数，都需要使用 TypeScript 进行类型标注。所有的依赖都已安装，无需手动安装。
二、本项目所有日期时间操作，都需要使用 dayjs 进行处理。

## 主进程

一、 主进程路由
主进程入口文件是 electron/main/index.ts。这个文件你不用改动，我已经封装好了。

Electron 项目通过 ipc 的方式进行通信。在主进程的 electron/main/router.ts，在默认导出的函数里面编写路由代码，使用 ipcMain.handle 方法管理路由。每个路由处理函数需要调用模块的 Controller 类，在 Controller 类中调用模块的 Service 类，Service 类之间可以互相调用。示例代码如下：

```ts
import { ipcMain } from 'electron';
import { ModelController } from './modules/model/model.controller';
const modelController = new ModelController();
ipcMain.handle('model-create', async (evt, data: string) => {
    return modelController.create(data);
});
```

如果有一个类调用另外一个类，需要对被调用的类进行委托。下面是示例代码：

```ts
import { ModelService } from './modules/model/model.service';
class ModelController {
    private modelService = new ModelService();
    create(data: string) {
        return this.modelService.create(JSON.parse(data));
    }
}
```

在 Controller 类中调用 Service 类，在方法中需要将传入参数用 JSON.parse 方法解析成对象，再传给 Service 类的方法使用。

二、应用数据管理
应用数据都存在本地，调用 electron/main/shared/sql.ts 中的方法进行增删改查。

```ts
import sql from './shared/sql';
(async () => {
    const list = await sql((db) => db.models);
})();
```

在通过 sql 函数存取数据时，需要在 sql 函数的参数类型声明中，添加对应的数据结构。请直接在 sql 这个文件中添加数据类型，不要从其他文件引入。

```ts
export interface StoredDataType {
    themes?: {
        id: number;
        name: string;
        createTime: string;
    }[];
}
```

如果其他文件有需要用到这个类型，请按照下面的代码调用：

```ts
import { StoredDataType } from './shared/sql';
type Theme = StoredDataType['themes'][number];
```

然后在调用的文件使用：

对于所有数据结构，有几点强调的：

1. 创建的数据结构，如果使用"id"这个字段作为唯一标识符，那么它的类型应该是 number 类型，从 1 开始自增。
2. 路由的功能如果是添加、编辑或者删除的，在没有特殊要求的情况下，不需要返回任何值。

三、调用 ai 模型
通过`openai`这个包来调用 ai 模型，具体使用方法可以参考官方文档。要做成和 ai 应用一样的分段返回 ai 生成的结果，所以要用`event.webContents.send`这个方法来分段返回,event 是一个 Electron 的事件对象，用于向渲染进程发送消息,在 ipcMain.handle 的回调函数中，第一个参数就是这个 event 对象。

## 渲染进程

渲染进程使用的是 Vue3 + element plus，查看的原型是用 tailwindcss 写的，但只是示例，不要在代码中使用 tailwindcss。
一、渲染进程通信
在渲染进程，通过引入 shared/request.ts 文件来发送 ipc 和接收，request 函数封装了 ipcRenderer.invoke 方法，传入两个参数，第一个是路由名称 String 类型，第二个参数是数据，any 类型。

```ts
import request from '@/shared/request';
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

四、element plus 使用要求

1. 使用 icon 的时候，应该使用"el-icon"来包裹。
