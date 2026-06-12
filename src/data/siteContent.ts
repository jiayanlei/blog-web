import type { CSSProperties } from 'react';

export type TimeNodeId = 'origin' | 'about' | 'stack' | 'projects' | 'highlights' | 'contact';

export type TimeNode = {
  id: TimeNodeId;
  label: string;
  aura: string;
};

export type Project = {
  title: string;
  tag: string;
  intro: string;
  abilities: string[];
  stack: string[];
  highlights: string[];
};

export type Highlight = {
  title: string;
  text: string;
  tone: string;
  span?: 'wide' | 'tall';
};

export type Skill = {
  name: string;
  orbit: number;
  angle: number;
  speed: number;
  depth: number;
  reverse?: boolean;
};

export type ReactBitsPlanItem = {
  label: string;
  value: string;
  style?: CSSProperties;
};

export type ArchivePost = {
  title: string;
  category: 'AI 实践' | '前端工程' | '全栈系统' | '产品思考';
  excerpt: string;
  status: 'draft' | 'planned';
};

export const timeNodes: TimeNode[] = [
  { id: 'origin', label: '起点', aura: 'rgba(246, 198, 106, 0.2)' },
  { id: 'about', label: '关于我', aura: 'rgba(120, 136, 184, 0.18)' },
  { id: 'stack', label: '技术栈', aura: 'rgba(168, 139, 250, 0.16)' },
  { id: 'projects', label: '项目作品', aura: 'rgba(246, 198, 106, 0.18)' },
  { id: 'highlights', label: 'AI 能力', aura: 'rgba(96, 165, 250, 0.16)' },
  { id: 'contact', label: '寻找我', aura: 'rgba(226, 232, 240, 0.12)' },
];

export const skills: Skill[] = [
  { name: 'React', orbit: 2, angle: 300, speed: 62, depth: 1.08 },
  { name: 'Vue', orbit: 2, angle: 8, speed: 64, depth: 0.96, reverse: true },
  { name: 'TypeScript', orbit: 3, angle: 132, speed: 80, depth: 1.06 },
  { name: 'JavaScript', orbit: 1, angle: 214, speed: 48, depth: 0.9, reverse: true },
  { name: 'Spring Boot', orbit: 4, angle: 188, speed: 94, depth: 1 },
  { name: 'PostgreSQL', orbit: 5, angle: 10, speed: 116, depth: 0.94, reverse: true },
  { name: 'Redis', orbit: 3, angle: 322, speed: 82, depth: 1.02 },
  { name: 'AI Agent', orbit: 5, angle: 146, speed: 122, depth: 1.12, reverse: true },
  { name: '数据可视化', orbit: 4, angle: 336, speed: 98, depth: 0.96 },
  { name: '前后端协作', orbit: 5, angle: 268, speed: 120, depth: 1.02 },
];

export const projects: Project[] = [
  {
    title: 'AI 智能工单分析系统',
    tag: '企业客服 / 运维 / 业务支持',
    intro: '面向企业客服、运维和业务支持场景，让工单流转、权限控制、AI 分析和效率看板形成闭环。',
    abilities: ['工单创建、分派、处理、流转、关闭', '角色权限、菜单权限、数据权限', 'AI 识别分类、优先级和处理建议', '数据大屏展示趋势、来源和处理效率'],
    stack: ['Vue3', 'TypeScript', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Render', 'Vercel'],
    highlights: ['AI 分类建议', 'RBAC 权限链路', '工单效率看板'],
  },
  {
    title: 'AI 企业知识库助手',
    tag: '知识管理 / AI 工作台 / 团队资产',
    intro: '帮助团队组织制度、流程、项目文档和员工手册，让知识可以被检索、追踪和持续沉淀。',
    abilities: ['企业知识库浏览与管理', '文档上传、解析和状态追踪', 'AI 问答助手与对话记录', '知识图谱与问答洞察'],
    stack: ['React', 'Vue3', 'TypeScript', 'AI 对话', '知识图谱', '文档解析', '权限控制'],
    highlights: ['三栏知识库布局', '知识图谱沉浸模式', 'AI 对话流式输出'],
  },
];

export const highlights: Highlight[] = [
  {
    title: 'AI 工作台',
    text: '把模型能力放进真实业务流程，让人可以在一个清晰界面里完成判断、检索与处理。',
    tone: 'cyan',
    span: 'wide',
  },
  {
    title: '企业知识库助手',
    text: '组织制度、流程、项目文档与团队经验，让知识可以被找到、被追问、被沉淀。',
    tone: 'emerald',
  },
  {
    title: '文档解析与洞察',
    text: '跟踪上传、解析、入库和问答状态，把散落内容转成可用的数据资产。',
    tone: 'rose',
  },
  {
    title: 'Agent 自动化',
    text: '围绕任务拆解、工具调用和结果校验，探索更稳定的 AI 协作方式。',
    tone: 'amber',
    span: 'wide',
  },
];

export const reactBitsPlan: ReactBitsPlanItem[] = [
  { label: 'ShinyText', value: '主标题流光' },
  { label: 'SplitReveal', value: '节点入场' },
  { label: 'SpotlightCard', value: '项目聚光' },
  { label: 'MagicBento', value: 'AI 能力矩阵' },
];

export const archiveBlueprint: ArchivePost[] = [
  {
    title: 'AI 工单系统从 0 到 1 的产品拆解',
    category: 'AI 实践',
    excerpt: '记录工单流转、权限模型、AI 分类建议和效率看板如何形成一个闭环。',
    status: 'planned',
  },
  {
    title: 'React 沉浸式作品集的动效边界',
    category: '前端工程',
    excerpt: '梳理 Three.js 背景、React Bits 组件和移动端性能之间的取舍。',
    status: 'draft',
  },
  {
    title: '企业知识库助手的信息架构',
    category: '产品思考',
    excerpt: '从文档上传、解析状态、知识图谱到 AI 问答，拆解知识沉淀的真实路径。',
    status: 'planned',
  },
];
