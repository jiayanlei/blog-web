export type SkillGroup = {
  title: string;
  text: string;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  role: string;
  points: string[];
};

export type Project = {
  title: string;
  role: string;
  period: string;
  stack: string;
  intro: string;
  points: string[];
};

export const profile = {
  name: '贾岩磊',
  title: '前端工程师 / 全栈开发',
  education: '本科',
  school: '东北林业大学',
  major: '计算机科学与技术',
};

export const openingFragments = ['Vue', 'TypeScript', 'Spring Boot', 'AI 工单', 'RBAC', '数据看板', 'PostgreSQL', 'Redis'];

export const skillGroups: SkillGroup[] = [
  {
    title: '前端技术',
    text: '熟悉 Vue2 / Vue3、TypeScript、JavaScript ES6+、Pinia/Vuex、Vue Router、Element Plus、Ant Design Vue、ECharts、AntV、Vite、Webpack。',
  },
  {
    title: 'Java 后端',
    text: '熟悉 Java、Spring Boot、Spring MVC、MyBatis-Plus，可完成 Controller、Service、Mapper、Entity、DTO/VO 分层开发。',
  },
  {
    title: 'AI 应用开发',
    text: '参与 AI 智能工单分类、问题摘要、处理建议、知识库推荐、数据分析看板等功能设计与前后端开发。',
  },
  {
    title: '数据库与缓存',
    text: '熟悉 MySQL、PostgreSQL 表结构设计、分页查询、条件查询、逻辑删除、基础 SQL 优化，以及 Redis 常见使用场景。',
  },
  {
    title: '权限与认证',
    text: '熟悉 Sa-Token / Token 登录认证方案，了解 RBAC 权限模型，可实现用户、角色、菜单、按钮权限和动态路由菜单。',
  },
  {
    title: '工程化与联调',
    text: '熟悉 Vite、Webpack、ESLint、Prettier、多环境配置、接口代理、Axios 封装、路由守卫、Git、Apifox、Swagger/OpenAPI。',
  },
];

export const experiences: Experience[] = [
  {
    title: '前端开发工程师',
    company: '首都公路发展集团有限公司',
    period: '2024.06 - 至今',
    role: '全栈工程师',
    points: [
      '主要负责 AI 智能工单分析系统前后端开发，覆盖工单创建、分类、流转、处理、关闭、知识库辅助和 AI 分析看板。',
      '参与用户、角色、菜单、工单、流转记录、附件、登录日志等模块表结构设计和基础接口开发。',
      '基于 Sa-Token 参与登录认证与权限体系建设，配合前端完成动态菜单和按钮级权限展示。',
      '参与工单分类、问题摘要、处理建议、知识库推荐、数据分析看板等 AI 工单能力建设。',
    ],
  },
  {
    title: '前端开发工程师',
    company: '中化学数智科技有限公司',
    period: '2022.03 - 2024.06',
    role: '前端工程师',
    points: [
      '参与内部门户 OA 系统、仓库管理系统、中台业务站点开发与架构支撑。',
      '主导 OA 系统核心模块开发，涵盖流程审批、日程管理、文档协作等功能。',
      '设计前端目录结构与状态管理方案，封装通用表单组件、权限控制 hooks 和全局请求工具。',
      '实现接口超时重试、Token 过期自动刷新、错误统一拦截，支撑公司日常办公系统稳定运行。',
    ],
  },
];

export const projects: Project[] = [
  {
    title: 'AI 智能工单分析系统',
    role: '全栈开发 / 项目负责人',
    period: '2025.11 - 至今',
    stack: 'Vue3 + TypeScript + Pinia + Element Plus + Java + Spring Boot + MyBatis-Plus + PostgreSQL + Redis',
    intro: '面向企业客服、运维、管理中心的智能工单分析平台，覆盖工单创建、分类、流转、处理、关闭、知识库辅助和 AI 分析看板等核心流程。',
    points: [
      '负责前后端开发，前端基于 Vue3 + TypeScript + Element Plus 搭建中后台系统，后端基于 Spring Boot + MyBatis-Plus 完成接口开发。',
      '基于 Sa-Token + RBAC 设计登录认证与权限体系，支持接口拦截、角色权限、菜单权限、按钮权限和动态路由。',
      '设计用户、角色、菜单、工单、流转记录、附件、登录日志等核心表结构，实现工单业务闭环。',
      '封装 Axios 请求、错误拦截、路由守卫、Tabs、KeepAlive、多环境配置等前端通用能力。',
    ],
  },
  {
    title: '营销数据平台',
    role: '前端项目组',
    period: '2022.12 - 2024.06',
    stack: 'Vue3 + TypeScript + Vite + Pinia + Vue Router + Element Plus + Axios + ECharts + UnoCSS',
    intro: '面向企业营销运营团队的数据分析平台，覆盖客户信息管理、用户画像分析、营销标签筛选、渠道效果分析、转化漏斗分析和报表导出。',
    points: [
      '负责客户画像、标签筛选、渠道分析、转化漏斗、报表导出等核心模块开发。',
      '封装查询表单、数据表格、筛选面板、图表卡片、导出组件等通用业务组件。',
      '优化分页查询、查询条件缓存、接口请求节流、图表按需渲染等逻辑。',
      '基于 ECharts 实现客户地域分布、渠道转化率、活动效果分析和转化漏斗等数据可视化能力。',
    ],
  },
  {
    title: 'WMS 仓库管理系统',
    role: '前端项目组',
    period: '2022.07 - 2024.04',
    stack: 'Vue3 + TypeScript + Vite + Pinia + Sass + Axios + ECharts',
    intro: '企业级仓储管理系统，覆盖物料入库、出库、库存盘点、库存预警、批次追溯、库位管理等核心业务流程。',
    points: [
      '负责库存查询、出入库管理、库位管理、批次追溯、库存预警、仓储数据看板等功能。',
      '封装库存筛选表单、可配置表格、状态标签、库存预警卡片、批次详情弹窗等业务组件。',
      '参与 SAP、ERP、MES 等系统接口联调，处理物料编码、批次号、库位、库存数量等关键字段映射。',
      '优化分页查询、条件缓存、表格渲染和接口并发请求，提升列表加载速度和页面操作流畅度。',
    ],
  },
  {
    title: 'SCM 内部供应链系统',
    role: '前端项目组',
    period: '2022.04 - 2024.06',
    stack: 'Vue2 + Pinia + TypeScript + Mint-UI + ECharts + Vite + Axios',
    intro: '企业级供应链管理系统，覆盖供应商协同、采购管理、库存管控、模具管理、报废审批、数据统计等业务场景。',
    points: [
      '负责供应商管理、采购流程、库存预警、模具管理、报废审批、数据看板等核心模块开发。',
      '封装查询表单、业务表格、审批弹窗、状态标签、详情抽屉、数据看板等通用组件。',
      '参与供应链相关接口联调，处理供应商、采购单、库存、模具、审批状态等核心字段映射。',
    ],
  },
];

export const selfReview = [
  '多年企业级中后台系统开发经验，熟悉 OA、供应链、WMS、营销数据平台、智能工单等业务场景。',
  '前端基础扎实，熟悉 Vue、TypeScript、组件封装、权限路由、状态管理和工程化配置。',
  '具备 Java 全栈开发意识，熟悉 Spring Boot、MyBatis-Plus、PostgreSQL、Redis、Sa-Token 等技术。',
  '做事稳定，问题定位能力强，注重代码可维护性和交付质量，能与产品、后端、测试协同推进项目落地。',
];
