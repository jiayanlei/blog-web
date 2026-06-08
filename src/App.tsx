import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownToLine,
  Bot,
  BrainCircuit,
  ChevronDown,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  Layers3,
  Mail,
  Map,
  Network,
  Radar,
  Rocket,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import ParticleNebula from './components/ParticleNebula';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

type OsModule = {
  title: string;
  icon: LucideIcon;
  gradient: string;
  items: string[];
};

type SkillGroup = {
  title: string;
  icon: LucideIcon;
  skills: {
    name: string;
    value: string;
  }[];
};

type Project = {
  title: string;
  tag: string;
  intro: string;
  abilities: string[];
  stack: string[];
  highlights?: string[];
};

const terminalLines = [
  'init profile',
  'loading skills...',
  'React loaded',
  'Vue3 loaded',
  'Spring Boot loaded',
  'PostgreSQL connected',
  'AI Knowledge Engine ready',
];

const openingText = '或许我们只是差了一些运气和机会，';

const osModules: OsModule[] = [
  {
    title: 'Frontend Engine',
    icon: Code2,
    gradient: 'from-cyan-400 to-blue-500',
    items: ['React', 'Vue3', 'TypeScript', '组件化', '权限路由', '数据可视化'],
  },
  {
    title: 'Backend Core',
    icon: ServerCog,
    gradient: 'from-blue-400 to-violet-500',
    items: ['Java', 'Spring Boot', 'MyBatis-Plus', 'Sa-Token', 'RBAC', 'RESTful API'],
  },
  {
    title: 'AI Layer',
    icon: BrainCircuit,
    gradient: 'from-violet-400 to-fuchsia-500',
    items: ['AI 问答', '知识检索', '智能工单分析', 'AI 工作台'],
  },
  {
    title: 'Data Center',
    icon: Database,
    gradient: 'from-emerald-300 to-cyan-500',
    items: ['PostgreSQL', 'Redis', '数据建模', '查询优化'],
  },
  {
    title: 'Deploy System',
    icon: Rocket,
    gradient: 'from-fuchsia-400 to-indigo-500',
    items: ['Vercel', 'Render', 'Docker', 'Nginx', 'GitHub'],
  },
];

const skillGroups: SkillGroup[] = [
  {
    title: '前端工程能力',
    icon: Layers3,
    skills: [
      { name: 'React', value: '构建交互复杂、状态清晰的业务工作台和可视化页面' },
      { name: 'Vue3', value: '快速交付企业后台、权限页面和多模块业务系统' },
      { name: 'TypeScript', value: '让接口、组件参数和业务状态更可控，减少线上隐患' },
      { name: 'Vite', value: '搭建轻量前端工程，提升本地开发与构建效率' },
      { name: 'Pinia', value: '管理用户、权限、菜单和跨页面业务状态' },
      { name: 'Axios', value: '封装请求、错误处理、鉴权续接和接口联调流程' },
      { name: 'TailwindCSS', value: '快速实现响应式、统一且可维护的现代 UI' },
      { name: '组件封装', value: '沉淀表格、筛选、弹窗、上传等高频业务组件' },
      { name: '数据大屏', value: '展示趋势、分布、效率和运营指标，辅助业务决策' },
    ],
  },
  {
    title: '后端工程能力',
    icon: Cpu,
    skills: [
      { name: 'Java 21', value: '实现清晰稳定的业务服务与领域逻辑' },
      { name: 'Spring Boot 3', value: '搭建 REST API、权限、配置和服务集成能力' },
      { name: 'MyBatis-Plus', value: '完成高可读性的 CRUD、分页和条件查询' },
      { name: 'Sa-Token', value: '处理登录态、角色校验和接口访问控制' },
      { name: 'RBAC 权限', value: '设计用户、角色、菜单、按钮和数据范围控制' },
      { name: '统一异常', value: '让错误返回稳定可读，便于前后端协作定位问题' },
      { name: '参数校验', value: '提前拦截非法输入，降低业务流程脏数据风险' },
      { name: '接口文档', value: '沉淀清晰接口契约，提高联调和交付效率' },
    ],
  },
  {
    title: '数据与部署能力',
    icon: Database,
    skills: [
      { name: 'PostgreSQL', value: '支撑业务建模、关联查询、统计分析和数据沉淀' },
      { name: 'Redis', value: '处理缓存、会话、热点数据和轻量队列场景' },
      { name: 'Docker', value: '统一运行环境，减少部署和迁移成本' },
      { name: 'Render', value: '快速托管后端服务，适合个人项目和演示环境' },
      { name: 'Vercel', value: '部署前端站点和静态应用，获得稳定访问入口' },
      { name: 'Supabase', value: '快速验证数据库、鉴权和文件存储相关想法' },
      { name: 'Nginx', value: '配置静态资源、代理转发和基础访问策略' },
      { name: 'GitHub', value: '管理代码、协作、版本记录和自动化部署触发' },
    ],
  },
  {
    title: 'AI 业务落地能力',
    icon: Bot,
    skills: [
      { name: 'AI 问答', value: '把自然语言入口接入实际业务流程和知识查询' },
      { name: '企业知识库', value: '组织制度、流程、文档和项目资产，提升检索效率' },
      { name: '智能工单分析', value: '识别分类、优先级和处理建议，辅助客服与运维' },
      { name: '文档解析', value: '追踪上传、解析、入库和可问答状态' },
      { name: '知识图谱', value: '把知识节点关系可视化，帮助用户理解上下文' },
      { name: '对话记录', value: '保留问题、答案和上下文，支持复盘与持续优化' },
      { name: '问答洞察', value: '统计高频问题、知识缺口和团队使用趋势' },
    ],
  },
];

const projects: Project[] = [
  {
    title: 'AI 智能工单分析系统',
    tag: '企业客服 / 运维 / 业务支持',
    intro: '面向企业客服、运维、业务支持场景的智能工单分析平台。',
    abilities: [
      '工单创建、分派、处理、流转、关闭',
      '角色权限、菜单权限、数据权限',
      'AI 分析工单内容，识别分类、优先级和处理建议',
      '数据大屏展示工单趋势、来源分布、处理效率',
      '后台管理、用户管理、角色管理、菜单管理',
    ],
    stack: [
      'Vue3',
      'TypeScript',
      'Vite',
      'Pinia',
      'Element Plus',
      'Java 21',
      'Spring Boot 3',
      'MyBatis-Plus',
      'Sa-Token',
      'PostgreSQL',
      'Redis',
      'Render',
      'Vercel',
    ],
    highlights: ['AI 分类建议', 'RBAC 权限链路', '工单效率看板'],
  },
  {
    title: 'AI 企业知识库助手',
    tag: '知识管理 / AI 工作台 / 团队资产',
    intro: '帮助企业员工快速查询制度、流程、项目文档、员工手册等内部知识。',
    abilities: [
      '企业知识库浏览',
      '知识库管理',
      '文档上传与解析',
      'AI 问答助手',
      '知识图谱',
      '团队资产库',
      '问答洞察',
      '企业文化',
      '系统设置',
      'AI 工作台',
    ],
    stack: ['React', 'Vue3', 'TypeScript', 'AI 对话', '知识图谱', '文档解析', '权限控制'],
    highlights: [
      '三栏知识库布局',
      '知识图谱沉浸模式',
      'AI 对话流式输出',
      '企业知识星图',
      '文档解析状态追踪',
      '权限与知识访问范围控制',
    ],
  },
];

const navItems = [
  { label: 'OS', href: '#engineer-os' },
  { label: 'Radar', href: '#skill-radar' },
  { label: 'Matrix', href: '#project-matrix' },
  { label: 'Contact', href: '#contact' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <motion.div
      className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.62, ease: 'easeOut' }}
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-300">{description}</p>
    </motion.div>
  );
}

function RevealCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.58, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function OpeningScene({ onFinish }: { onFinish: () => void }) {
  const characters = useMemo(() => Array.from(openingText), []);

  useEffect(() => {
    const finishTimer = window.setTimeout(onFinish, 3400);
    const skipIntro = (event: Event) => {
      if (
        event instanceof KeyboardEvent &&
        !['Enter', ' ', 'Escape', 'ArrowDown', 'PageDown'].includes(event.key)
      ) {
        return;
      }

      onFinish();
    };

    window.addEventListener('wheel', skipIntro, { passive: true });
    window.addEventListener('touchstart', skipIntro, { passive: true });
    window.addEventListener('keydown', skipIntro);

    return () => {
      window.clearTimeout(finishTimer);
      window.removeEventListener('wheel', skipIntro);
      window.removeEventListener('touchstart', skipIntro);
      window.removeEventListener('keydown', skipIntro);
    };
  }, [onFinish]);

  return (
    <motion.section
      className="opening-scene fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-night px-5 text-center text-white"
      aria-label="开场动画"
      onClick={onFinish}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="opening-starfield pointer-events-none absolute inset-0" />
      <div className="opening-grid pointer-events-none absolute inset-0" />
      <span className="opening-meteor opening-meteor-1" />
      <span className="opening-meteor opening-meteor-2" />
      <span className="opening-meteor opening-meteor-3" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="mb-7 flex items-center justify-center gap-3 text-xs font-semibold uppercase text-cyan-200/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="h-px w-12 bg-cyan-200/35" />
          <span>Before the build</span>
          <span className="h-px w-12 bg-cyan-200/35" />
        </motion.div>

        <h1 className="opening-text relative mx-auto text-3xl font-semibold leading-[1.55] text-white sm:text-5xl lg:text-6xl">
          {characters.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className="opening-char inline-block"
              initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.52,
                delay: 0.42 + index * 0.055,
                ease: 'easeOut',
              }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            className="opening-text-sweep pointer-events-none absolute inset-y-0 left-0"
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.25, delay: 1.65, ease: 'easeInOut' }}
          />
        </h1>

        <motion.button
          type="button"
          className="opening-enter-button mx-auto mt-12 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/25 bg-white/[0.04] text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-200/10"
          aria-label="跳过开场动画"
          onClick={(event) => {
            event.stopPropagation();
            onFinish();
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [10, 0, 6, 0] }}
          transition={{ duration: 1.35, delay: 2.05, ease: 'easeOut' }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.section>
  );
}

function AppContent() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    if (!introDone) {
      return undefined;
    }

    setVisibleLines(0);

    const timer = window.setInterval(() => {
      setVisibleLines((count) => {
        if (count >= terminalLines.length) {
          window.clearInterval(timer);
          return count;
        }

        return count + 1;
      });
    }, 520);

    return () => window.clearInterval(timer);
  }, [introDone]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-night text-slate-100">
      <ParticleNebula />
      <div className="thin-grid pointer-events-none fixed inset-0 -z-10 opacity-50" />
      <div className="scanline pointer-events-none fixed left-0 top-0 -z-10 h-[36rem] w-full animate-scan opacity-70" />
      <div className="meteor-field pointer-events-none fixed inset-0 -z-10">
        <span />
        <span />
        <span />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0,rgba(5,8,22,0.35)_58%,rgba(5,8,22,0.9)_100%)]" />

      <AnimatePresence>{!introDone && <OpeningScene onFinish={() => setIntroDone(true)} />}</AnimatePresence>

      <header className="nav-blur fixed left-0 right-0 top-0 z-30">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#hero" className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
              <Cpu className="h-4 w-4" />
            </span>
            AI Cockpit
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 18 }}
        transition={{ duration: 0.72, delay: introDone ? 0.22 : 0, ease: 'easeOut' }}
        className={introDone ? '' : 'pointer-events-none'}
      >
        <section
          id="hero"
          className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-5 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.03fr_0.97fr] lg:pt-20"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              AI 全栈工程师能力驾驶舱
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
              你好，我是 <span className="text-gradient">贾延磊</span>
            </h1>
            <p className="mt-5 text-xl font-medium text-cyan-100 sm:text-2xl">
              AI 全栈工程师 / 企业系统架构实践者
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              擅长 Vue3、React、TypeScript、Spring Boot、PostgreSQL、Redis、AI 业务落地。
              我把前端体验、后端业务、数据能力和 AI 场景整合成可交付的企业级系统。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#project-matrix"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                <Map className="h-4 w-4" />
                查看项目矩阵
              </a>
              <a
                href="#skill-radar"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                <Radar className="h-4 w-4" />
                查看技术栈
              </a>
              <a
                href="/resume.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300/40 hover:bg-violet-300/10"
              >
                <ArrowDownToLine className="h-4 w-4" />
                下载简历
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ['Full Stack', '前后端闭环'],
                ['AI Native', '业务智能化'],
                ['Enterprise', '企业系统实践'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-xs text-slate-400">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.12, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -left-8 top-8 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <Terminal className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Console</p>
                    <p className="text-xs text-slate-400">profile.boot.sequence</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="min-h-[17rem] rounded-xl border border-cyan-300/15 bg-slate-950/70 p-4 font-mono text-sm text-cyan-50 shadow-inner shadow-cyan-950/40 sm:p-5">
                {terminalLines.slice(0, visibleLines).map((line) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24 }}
                    className="terminal-line mb-3"
                  >
                    {line}
                  </motion.p>
                ))}
                <span className="inline-block h-5 w-2 animate-pulse bg-cyan-200 align-middle" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">System</p>
                  <p className="mt-2 text-lg font-semibold text-white">Ready</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mode</p>
                  <p className="mt-2 text-lg font-semibold text-white">Build AI</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="engineer-os" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeader
            eyebrow="Engineer OS"
            title="我的能力操作系统"
            description="把前端体验、后端服务、数据中心、AI 能力和部署链路组合成一套可以持续交付的工程系统。"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {osModules.map((module, index) => {
              const Icon = module.icon;

              return (
                <RevealCard key={module.title} delay={index * 0.05}>
                  <div className="glass-panel group h-full rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-glow">
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient} text-white`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {module.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </RevealCard>
              );
            })}
          </div>
        </section>

        <section id="skill-radar" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeader
            eyebrow="Skill Radar"
            title="技术栈能力矩阵"
            description="不只是列技术名，而是对应到我能解决的工程问题、业务问题和交付问题。"
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {skillGroups.map((group, groupIndex) => {
              const Icon = group.icon;

              return (
                <RevealCard key={group.title} delay={groupIndex * 0.06}>
                  <div className="glass-panel h-full rounded-2xl p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.08] hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                            <p className="font-semibold text-white">{skill.name}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{skill.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealCard>
              );
            })}
          </div>
        </section>

        <section id="project-matrix" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeader
            eyebrow="Project Matrix"
            title="项目矩阵"
            description="重点展示两个 AI 业务落地项目：一个连接企业工单流程，一个组织企业知识资产。"
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <RevealCard key={project.title} delay={index * 0.08}>
                <div className="glass-panel group relative h-full overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-glow sm:p-6">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400" />
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-cyan-200">{project.tag}</p>
                      <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-violet-200">
                      <Network className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="text-base leading-7 text-slate-300">{project.intro}</p>

                  <div className="mt-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Core Capability
                    </p>
                    <div className="space-y-3">
                      {project.abilities.map((ability) => (
                        <div key={ability} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                          <span>{ability}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((stack) => (
                      <span
                        key={stack}
                        className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-100"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>

                  {project.highlights && (
                    <div className="mt-6 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 opacity-100 transition duration-300 lg:opacity-0 lg:translate-y-2 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-100">
                        <Zap className="h-4 w-4" />
                        项目亮点
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.highlights.map((highlight) => (
                          <span key={highlight} className="rounded-lg bg-white/[0.07] px-3 py-2 text-xs text-slate-200">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </RevealCard>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <RevealCard>
            <div className="glass-panel overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Contact
                  </p>
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    让 AI 能力进入真实业务系统
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                    如果你需要企业后台、AI 工单、知识库、数据看板或全栈系统落地，我可以从页面体验、接口设计、数据建模到部署上线一起推进。
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <a
                    href="mailto:contact@example.com"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-white">
                      <Mail className="h-4 w-4 text-cyan-200" />
                      contact@example.com
                    </span>
                    <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-cyan-200" />
                  </a>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 transition hover:border-violet-300/40 hover:bg-violet-300/10"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-white">
                      <GitBranch className="h-4 w-4 text-violet-200" />
                      GitHub / Project Space
                    </span>
                    <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-violet-200" />
                  </a>
                </div>
              </div>
            </div>
          </RevealCard>
        </section>
      </motion.main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-500 sm:px-8">
        © {currentYear} 贾延磊. AI Full Stack Engineer Cockpit.
      </footer>
    </div>
  );
}

function App() {
  return (
    <ParticlesProvider init={loadSlim}>
      <AppContent />
    </ParticlesProvider>
  );
}

export default App;
