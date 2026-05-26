# 任务管理系统 (Todo Pro)

一个基于 Vue 3 的功能完整、界面清晰、支持数据持久化的任务管理系统。

## 技术栈

- **Vue 3** — 渐进式 JavaScript 框架
- **Vite** — 前端构建工具
- **Vue Router 4** — 路由管理
- **Pinia** — 状态管理
- **Element Plus** — UI 组件库
- **ECharts** — 数据可视化图表
- **Day.js** — 日期处理
- **localStorage** — 浏览器本地存储

## 功能列表

### 基础功能

- [x] 新增任务 — 支持标题、描述、优先级、分类、截止日期
- [x] 编辑任务 — 修改任意字段
- [x] 删除任务 — 带确认提示
- [x] 状态切换 — 待办 → 进行中 → 已完成（循环切换）
- [x] 搜索筛选 — 按关键词、状态、优先级、分类、逾期筛选
- [x] 排序功能 — 按创建时间、截止日期、优先级排序，支持升降序切换
- [x] 数据持久化 — localStorage 自动保存

### 标准功能

- [x] Vue Router 多页面（仪表盘、任务列表、统计分析、设置）
- [x] Pinia 状态管理
- [x] 优先级管理（高、中、低）
- [x] 分类管理（支持自定义标签）
- [x] 截止日期
- [x] 表单校验

### 拓展功能

- [x] 统计图表 — 使用 ECharts 展示状态分布、优先级分布、分类分布、完成趋势
- [x] 深色/浅色主题切换
- [x] 数据导出/导入（JSON 格式）
- [x] 批量清除已完成任务
- [x] 清空全部数据
- [x] 响应式布局（适配电脑端和手机端）
- [x] 侧边栏折叠

## 项目结构

```
todo-pro/
├── public/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── global.css          # 全局样式 & 主题变量
│   ├── components/
│   │   ├── TaskCard.vue            # 任务卡片组件
│   │   └── TaskForm.vue            # 新增/编辑任务弹窗
│   ├── views/
│   │   ├── DashboardView.vue       # 首页 / 仪表盘
│   │   ├── TaskListView.vue        # 任务列表页
│   │   ├── StatsView.vue           # 统计分析页
│   │   └── SettingsView.vue        # 设置页
│   ├── router/
│   │   └── index.js                # Vue Router 配置
│   ├── stores/
│   │   └── taskStore.js            # Pinia 状态管理
│   ├── utils/
│   │   └── storage.js              # localStorage 工具函数
│   ├── App.vue                     # 根组件（布局）
│   └── main.js                     # 入口文件
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 项目运行步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览生产版本
npm run preview
```

## 数据持久化方案

本项目采用 **localStorage 本地存储** 方案：

- 新增、编辑、删除任务后，数据自动保存到浏览器 localStorage
- 刷新页面后任务数据不会丢失
- 提供数据导出（JSON 文件下载）和导入（上传 JSON 文件）功能
- 支持清空全部数据
- 主题设置（深色/浅色）也保存在 localStorage 中

### 存储 Key

| Key | 说明 |
| --- | --- |
| `todo-pro-tasks` | 任务列表数据 |
| `todo-pro-theme` | 主题设置（light / dark） |

## 任务字段说明

| 字段 | 说明 |
| --- | --- |
| `id` | 任务唯一标识 |
| `title` | 任务标题（必填） |
| `description` | 任务描述 |
| `status` | 待办(todo) / 进行中(in-progress) / 已完成(done) |
| `priority` | 低(low) / 中(medium) / 高(high) |
| `category` | 分类或标签 |
| `dueDate` | 截止日期（YYYY-MM-DD） |
| `createdAt` | 创建时间（ISO 8601） |
| `updatedAt` | 更新时间（ISO 8601） |

## Git 提交记录

项目使用 Git 进行版本管理。查看提交记录：

```bash
git log --oneline --graph --decorate
```
