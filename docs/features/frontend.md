# Prompt Studio 前端项目分析

## 1. 项目基本结构

项目采用 Vue3 + TypeScript 技术栈，主要目录结构如下：

-   `src/`: Vue3 前端代码
    -   `components/`: 可复用组件，如 ModelDialog.vue 等
    -   `views/`: 页面级组件，包含主要功能页面
    -   `router/`: 路由配置，管理页面导航
    -   `styles/`: 样式文件，包含多个 SCSS 模块
    -   `shared/`: 共享工具和服务，如 request.ts 和 util.ts

## 2. 主要功能模块

根据项目结构和代码分析，主要功能模块包括：

1. 主页面模块（Home.vue）
2. 历史记录模块（HistoryList.vue）
3. 历史对比功能（HistoryCompare.vue）
4. 主题详情模块（ThemeDetail.vue）
5. 模型对话框组件（ModelDialog.vue）

这些模块之间通过 Vue Router 进行导航和状态管理，共同构成了完整的应用功能。

## 3. 代码组织方式

项目采用了现代化的模块化和组件化开发方式：

1. **模块化**：

    - 使用 ES Modules 进行代码模块化管理
    - 采用 TypeScript 进行类型管理
    - 清晰的目录结构划分不同职责的代码

2. **组件化**：

    - 基于 Vue3 组件化开发
    - 将 UI 拆分为可复用的组件
    - 组件间通过 props 和事件进行通信

3. **样式管理**：
    - 使用 SCSS 预处理器
    - 模块化的样式文件组织（animation.scss, atom.scss, common.scss 等）
    - 包含动画、原子类、混入等样式工具

## 4. 源码目录文件说明

-   `App.vue`: 应用根组件
-   `main.ts`: 应用入口文件
-   `vite-env.d.ts`: Vite 环境类型声明
-   `components/`: 组件目录
    -   `ModelDialog.vue`: 模型对话框组件
-   `router/index.ts`: 路由配置文件
-   `shared/`: 工具目录
    -   `request.ts`: 网络请求工具
    -   `util.ts`: 通用工具函数
-   `styles/`: 样式目录
    -   `animation.scss`: 动画样式
    -   `atom.scss`: 原子类样式
    -   `common.scss`: 通用样式
    -   `element.scss`: Element Plus 样式覆盖
    -   `flex.scss`: Flex 布局样式
    -   `mixin.scss`: SCSS 混入
    -   `reset.scss`: 样式重置

## 5. 主要页面分析

1. **首页 (Home.vue)**

    - 应用的主要交互界面
    - 集成了模型对话功能

2. **历史列表 (HistoryList.vue)**

    - 展示历史记录
    - 提供历史记录管理功能

3. **历史对比 (HistoryCompare.vue)**

    - 支持历史记录的对比功能
    - 可视化展示差异

4. **主题详情 (ThemeDetail.vue)**
    - 展示主题相关信息
    - 提供主题设置功能

所有页面都采用了 Element Plus 组件库构建，确保了统一的设计风格和用户体验。页面布局采用响应式设计，能够适应不同尺寸的窗口显示。
