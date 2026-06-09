import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, TouchEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownToLine,
  Bot,
  Cpu,
  ExternalLink,
  GitBranch,
  Layers3,
  Mail,
  Map,
  Network,
  Radar,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DynamicHeroBackground from './components/DynamicHeroBackground';

type TimeNodeId = 'origin' | 'about' | 'stack' | 'projects' | 'highlights' | 'contact';

type TimeNode = {
  id: TimeNodeId;
  label: string;
  orbit: string;
  aura: string;
};

type Project = {
  title: string;
  tag: string;
  intro: string;
  abilities: string[];
  stack: string[];
  highlights: string[];
};

type Highlight = {
  title: string;
  text: string;
  icon: LucideIcon;
  tone: string;
};

const CONTENT_SWAP_MS = 720;
const TRANSITION_MS = 1180;
const WHEEL_THROTTLE_MS = 760;

const openingText = '或许，我们只是差了一些运气和机会。';

const timeNodes: TimeNode[] = [
  {
    id: 'origin',
    label: '起点',
    orbit: '00',
    aura: 'rgba(246, 198, 106, 0.2)',
  },
  {
    id: 'about',
    label: '关于我',
    orbit: '01',
    aura: 'rgba(120, 136, 184, 0.18)',
  },
  {
    id: 'stack',
    label: '技术栈',
    orbit: '02',
    aura: 'rgba(168, 139, 250, 0.16)',
  },
  {
    id: 'projects',
    label: '项目作品',
    orbit: '03',
    aura: 'rgba(246, 198, 106, 0.18)',
  },
  {
    id: 'highlights',
    label: 'AI 能力',
    orbit: '04',
    aura: 'rgba(96, 165, 250, 0.16)',
  },
  {
    id: 'contact',
    label: '寻找我',
    orbit: '05',
    aura: 'rgba(226, 232, 240, 0.12)',
  },
];

const skillMeteors = [
  { label: 'React', x: '14%', y: '22%', driftX: '18px', driftY: '-14px', duration: '7.2s', delay: '-1.1s' },
  { label: 'Vue', x: '50%', y: '13%', driftX: '-16px', driftY: '12px', duration: '6.6s', delay: '-2.4s' },
  { label: 'TypeScript', x: '78%', y: '25%', driftX: '14px', driftY: '16px', duration: '7.8s', delay: '-0.8s' },
  { label: 'JavaScript', x: '32%', y: '38%', driftX: '-18px', driftY: '-10px', duration: '6.9s', delay: '-1.8s' },
  { label: 'Spring Boot', x: '64%', y: '43%', driftX: '17px', driftY: '-18px', duration: '8.2s', delay: '-3s' },
  { label: 'PostgreSQL', x: '18%', y: '61%', driftX: '14px', driftY: '18px', duration: '7.5s', delay: '-0.4s' },
  { label: 'Redis', x: '82%', y: '62%', driftX: '-18px', driftY: '14px', duration: '6.8s', delay: '-2.1s' },
  { label: 'AI Agent', x: '42%', y: '70%', driftX: '-15px', driftY: '-16px', duration: '7.1s', delay: '-1.5s' },
  { label: '数据可视化', x: '61%', y: '82%', driftX: '16px', driftY: '10px', duration: '8s', delay: '-2.7s' },
  { label: '前后端协作', x: '31%', y: '84%', driftX: '-12px', driftY: '14px', duration: '7.6s', delay: '-0.9s' },
] as const;

const skillDebris = [
  { x: '9%', y: '14%', size: '0.55rem', driftX: '12px', driftY: '-10px', duration: '6.8s', delay: '-1.4s' },
  { x: '29%', y: '12%', size: '0.34rem', driftX: '-8px', driftY: '14px', duration: '7.6s', delay: '-2.6s' },
  { x: '71%', y: '11%', size: '0.42rem', driftX: '10px', driftY: '13px', duration: '6.3s', delay: '-0.5s' },
  { x: '91%', y: '34%', size: '0.5rem', driftX: '-13px', driftY: '-8px', duration: '8.1s', delay: '-3.1s' },
  { x: '7%', y: '44%', size: '0.38rem', driftX: '11px', driftY: '9px', duration: '7.2s', delay: '-1.9s' },
  { x: '47%', y: '31%', size: '0.48rem', driftX: '-10px', driftY: '-12px', duration: '6.9s', delay: '-0.8s' },
  { x: '74%', y: '47%', size: '0.32rem', driftX: '9px', driftY: '-11px', duration: '7.5s', delay: '-2.2s' },
  { x: '26%', y: '56%', size: '0.46rem', driftX: '-13px', driftY: '8px', duration: '6.7s', delay: '-1.2s' },
  { x: '52%', y: '61%', size: '0.36rem', driftX: '10px', driftY: '12px', duration: '8s', delay: '-3.4s' },
  { x: '93%', y: '73%', size: '0.42rem', driftX: '-12px', driftY: '10px', duration: '7.4s', delay: '-2.8s' },
  { x: '12%', y: '82%', size: '0.5rem', driftX: '8px', driftY: '-13px', duration: '7s', delay: '-0.7s' },
  { x: '48%', y: '91%', size: '0.3rem', driftX: '-8px', driftY: '-10px', duration: '6.4s', delay: '-2s' },
] as const;

const projects: Project[] = [
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

const highlights: Highlight[] = [
  {
    title: 'AI 工作台',
    text: '把模型能力放进真实业务流程，让人可以在一个清晰界面里完成判断、检索与处理。',
    icon: Layers3,
    tone: 'cyan',
  },
  {
    title: '企业知识库助手',
    text: '组织制度、流程、项目文档与团队经验，让知识可以被找到、被追问、被沉淀。',
    icon: Bot,
    tone: 'emerald',
  },
  {
    title: '文档解析与洞察',
    text: '跟踪上传、解析、入库和问答状态，把散落内容转成可用的数据资产。',
    icon: ShieldCheck,
    tone: 'rose',
  },
  {
    title: 'Agent 自动化',
    text: '围绕任务拆解、工具调用和结果校验，探索更稳定的 AI 协作方式。',
    icon: Zap,
    tone: 'amber',
  },
];

const sectionVariants = {
  enter: { opacity: 0, scale: 0.985, filter: 'blur(20px)' },
  center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(22px)' },
};

const softRise = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function App() {
  return <TimeClockHome />;
}

function TimeClockHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentIndexRef = useRef(currentIndex);
  const isAnimatingRef = useRef(isAnimating);
  const lastWheelAtRef = useRef(0);
  const contentSwapTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const activeNode = timeNodes[currentIndex];
  const auraNode = targetIndex === null ? activeNode : timeNodes[targetIndex];

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const moveToIndex = useCallback((nextIndex: number) => {
    if (
      nextIndex < 0 ||
      nextIndex >= timeNodes.length ||
      nextIndex === currentIndexRef.current ||
      isAnimatingRef.current
    ) {
      return;
    }

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    if (contentSwapTimerRef.current) {
      window.clearTimeout(contentSwapTimerRef.current);
    }

    setTargetIndex(nextIndex);
    setIsAnimating(true);
    isAnimatingRef.current = true;

    contentSwapTimerRef.current = window.setTimeout(() => {
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
      contentSwapTimerRef.current = null;
    }, CONTENT_SWAP_MS);

    transitionTimerRef.current = window.setTimeout(() => {
      setTargetIndex(null);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      transitionTimerRef.current = null;
    }, TRANSITION_MS);
  }, []);

  const moveBy = useCallback(
    (direction: 1 | -1) => {
      moveToIndex(currentIndexRef.current + direction);
    },
    [moveToIndex],
  );

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();
      if (Math.abs(event.deltaY) < 18 || now - lastWheelAtRef.current < WHEEL_THROTTLE_MS) {
        return;
      }

      lastWheelAtRef.current = now;
      moveBy(event.deltaY > 0 ? 1 : -1);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        moveBy(1);
      }

      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        moveBy(-1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [moveBy]);

  useEffect(() => {
    return () => {
      if (contentSwapTimerRef.current) {
        window.clearTimeout(contentSwapTimerRef.current);
      }

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width;
    const yRatio = (event.clientY - rect.top) / rect.height;
    const x = xRatio * 100;
    const y = yRatio * 100;
    const xOffset = xRatio - 0.5;
    const yOffset = yRatio - 0.5;

    event.currentTarget.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty('--hero-parallax-x', `${(-xOffset * 18).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--hero-parallax-y', `${(-yOffset * 12).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--hero-fog-x', `${(-xOffset * 28).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--hero-fog-y', `${(-yOffset * 16).toFixed(2)}px`);
  }, []);

  const handlePointerLeave = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '50%');
    event.currentTarget.style.setProperty('--pointer-y', '50%');
    event.currentTarget.style.setProperty('--hero-parallax-x', '0px');
    event.currentTarget.style.setProperty('--hero-parallax-y', '0px');
    event.currentTarget.style.setProperty('--hero-fog-x', '0px');
    event.currentTarget.style.setProperty('--hero-fog-y', '0px');
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchStartYRef.current === null) {
        return;
      }

      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const distance = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (Math.abs(distance) < 48) {
        return;
      }

      moveBy(distance > 0 ? 1 : -1);
    },
    [moveBy],
  );

  const homeStyle = {
    '--node-aura': auraNode.aura,
    '--pointer-x': '50%',
    '--pointer-y': '50%',
    '--hero-parallax-x': '0px',
    '--hero-parallax-y': '0px',
    '--hero-fog-x': '0px',
    '--hero-fog-y': '0px',
  } as CSSProperties;

  return (
    <div
      className="time-clock-home"
      style={homeStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <DynamicHeroBackground />

      <AnimatePresence mode="wait">
        <TimeNodeSection key={activeNode.id} node={activeNode}>
          <TimeNodeContent nodeId={activeNode.id} />
        </TimeNodeSection>
      </AnimatePresence>

      <TimeNodeNav
        nodes={timeNodes}
        currentIndex={currentIndex}
        targetIndex={targetIndex}
        isAnimating={isAnimating}
        onSelect={moveToIndex}
      />

      <AnimatePresence>
        {isAnimating && targetIndex !== null && (
          <TimeClockTransition key={targetIndex} />
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeNodeSection({ node, children }: { node: TimeNode; children: ReactNode }) {
  return (
    <motion.section
      className={`time-node-section time-node-section--${node.id}`}
      aria-label={node.label}
      variants={sectionVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="time-node-inner">{children}</div>
    </motion.section>
  );
}

function TimeNodeContent({ nodeId }: { nodeId: TimeNodeId }) {
  switch (nodeId) {
    case 'origin':
      return <OriginNode />;
    case 'about':
      return <AboutNode />;
    case 'stack':
      return <StackNode />;
    case 'projects':
      return <ProjectsNode />;
    case 'highlights':
      return <HighlightsNode />;
    case 'contact':
      return <ContactNode />;
  }
}

function OriginNode() {
  const characters = useMemo(() => Array.from(openingText), []);

  return (
    <div className="origin-stage cinematic-copy">
      <motion.div
        className="origin-copy"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.28, ease: 'easeOut' }}
      >
        <motion.div
          className="origin-orbit-label"
          initial={{ opacity: 0, letterSpacing: '0.32em' }}
          animate={{ opacity: 1, letterSpacing: '0.18em' }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          命运石之门
        </motion.div>
        <h1 className="origin-line">
          {characters.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className="origin-char"
              initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.48,
                delay: 0.56 + index * 0.045,
                ease: 'easeOut',
              }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            className="origin-line-sweep"
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 0.72, 0] }}
            transition={{ duration: 1.16, delay: 1.56, ease: 'easeInOut' }}
          />
        </h1>
        <motion.p
          className="origin-note"
          variants={softRise}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.62, delay: 2.15, ease: 'easeOut' }}
        >
          但时间，会把答案交给坚持的人。
        </motion.p>
      </motion.div>
    </div>
  );
}

function AboutNode() {
  return (
    <div className="node-layout story-node">
      <motion.div
        variants={softRise}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.58, ease: 'easeOut' }}
      >
        <NodeHeader
          icon={Cpu}
          eyebrow="Personal Fragment"
          title="贾岩磊"
          description="前端工程师 / AI 业务系统探索者"
        />
        <p className="node-lead">
          关注企业级系统、数据可视化、AI 工作台与全栈能力建设。
          希望把技术、设计与业务理解融合成真正有价值的产品体验。
        </p>

        <div className="signal-grid">
          {[
            ['Full Stack', '前后端闭环'],
            ['AI Native', '业务智能化'],
            ['Enterprise', '企业系统实践'],
          ].map(([label, value]) => (
            <div key={label} className="signal-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StackNode() {
  return (
    <div className="node-layout orbit-node">
      <NodeHeader
        icon={Radar}
        eyebrow="Time Orbit"
        title="技术栈"
        description="能力像陨石碎片散落在时间轨道中，围绕真实问题慢慢形成自己的引力。"
        align="center"
      />

      <div className="skill-orbit" aria-label="技术栈陨石群">
        {skillDebris.map((particle, index) => (
          <span
            key={index}
            className="skill-debris"
            style={
              {
                '--debris-x': particle.x,
                '--debris-y': particle.y,
                '--debris-size': particle.size,
                '--debris-drift-x': particle.driftX,
                '--debris-drift-y': particle.driftY,
                '--debris-duration': particle.duration,
                '--debris-delay': particle.delay,
              } as CSSProperties
            }
            aria-hidden="true"
          />
        ))}

        {skillMeteors.map((skill, index) => (
          <motion.span
            key={skill.label}
            className="skill-meteor"
            style={
              {
                '--skill-x': skill.x,
                '--skill-y': skill.y,
                '--skill-drift-x': skill.driftX,
                '--skill-drift-y': skill.driftY,
                '--skill-duration': skill.duration,
                '--skill-delay': skill.delay,
              } as CSSProperties
            }
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.08 + index * 0.04, ease: 'easeOut' }}
          >
            <span className="skill-meteor-rock" aria-hidden="true" />
            {skill.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function ProjectsNode() {
  return (
    <div className="node-layout archive-node">
      <NodeHeader
        icon={Map}
        eyebrow="Time Archive"
        title="项目作品"
        description="像从钟面中抽出的时间档案，记录那些被真实需求推动过的系统片段。"
        align="center"
      />

      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="project-card"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
          >
            <div className="project-head">
              <div>
                <p>{project.tag}</p>
                <h3>{project.title}</h3>
              </div>
              <span>
                <Network className="h-5 w-5" />
              </span>
            </div>
            <p className="project-intro">{project.intro}</p>
            <div className="project-abilities">
              {project.abilities.map((ability) => (
                <span key={ability}>
                  <ShieldCheck className="h-4 w-4" />
                  {ability}
                </span>
              ))}
            </div>
            <div className="project-stack">
              {project.stack.map((stack) => (
                <span key={stack}>{stack}</span>
              ))}
            </div>
            <button type="button" className="archive-action">查看详情</button>
            <div className="project-highlights">
              {project.highlights.map((highlight) => (
                <strong key={highlight}>{highlight}</strong>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function HighlightsNode() {
  return (
    <div className="node-layout ai-node">
      <NodeHeader
        icon={Zap}
        eyebrow="AI Fragment"
        title="AI 能力"
        description="让未来感留在能力里，让视觉仍然属于这座安静运转的古老时钟。"
        align="center"
      />

      <div className="highlight-grid">
        {highlights.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.title}
              className={`highlight-card highlight-card--${item.tone}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + index * 0.07, ease: 'easeOut' }}
            >
              <span>
                <Icon className="h-5 w-5" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function ContactNode() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="node-layout node-layout--split ending-node">
      <motion.div
        variants={softRise}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.58, ease: 'easeOut' }}
      >
        <NodeHeader
          icon={Mail}
          eyebrow="Last Fragment"
          title="如果时间刚好"
          description="我们可以一起做点有意思的东西。"
        />
        <p className="copyright">© {currentYear} 贾岩磊. AI Full Stack Engineer Cockpit.</p>
      </motion.div>

      <motion.div
        className="contact-panel"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.62, delay: 0.12, ease: 'easeOut' }}
      >
        <ContactLink icon={Mail} label="contact@example.com" href="mailto:contact@example.com" />
        <ContactLink icon={GitBranch} label="GitHub / Project Space" href="https://github.com/" external />
        <ContactLink icon={ArrowDownToLine} label="下载简历" href="/resume.pdf" />
      </motion.div>
    </div>
  );
}

function NodeHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}) {
  return (
    <motion.div
      className={align === 'center' ? 'node-header node-header--center' : 'node-header'}
      variants={softRise}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.58, ease: 'easeOut' }}
    >
      <span className="node-header-icon">
        <Icon className="h-5 w-5" />
      </span>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <strong>{description}</strong>
    </motion.div>
  );
}

function ContactLink({
  icon: Icon,
  label,
  href,
  external = false,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      <span>
        <Icon className="h-5 w-5" />
        {label}
      </span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

function TimeNodeNav({
  nodes,
  currentIndex,
  targetIndex,
  isAnimating,
  onSelect,
}: {
  nodes: TimeNode[];
  currentIndex: number;
  targetIndex: number | null;
  isAnimating: boolean;
  onSelect: (index: number) => void;
}) {
  const visualIndex = targetIndex ?? currentIndex;

  return (
    <nav className="time-node-nav" aria-label="首页节点导航">
      {nodes.map((node, index) => {
        const isActive = index === visualIndex;

        return (
          <button
            key={node.id}
            type="button"
            className={isActive ? 'time-node-nav-item is-active' : 'time-node-nav-item'}
            onClick={() => onSelect(index)}
            disabled={isAnimating}
            aria-current={index === currentIndex ? 'step' : undefined}
          >
            <span className="time-node-nav-dot" aria-hidden="true">·</span>
            <span className="time-node-nav-label">{node.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TimeClockTransition() {
  const ticks = useMemo(() => Array.from({ length: 60 }), []);
  const particles = useMemo(() => Array.from({ length: 28 }), []);

  return (
    <motion.div
      className="time-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
    >
      <motion.div
        className="time-transition-halo"
        initial={{ scale: 0.25, opacity: 0 }}
        animate={{ scale: [0.25, 1.12, 1.42], opacity: [0, 0.72, 0] }}
        transition={{ duration: 1.18, ease: 'easeOut' }}
      />

      <div className="time-transition-particles" aria-hidden="true">
        {particles.map((_, index) => {
          const angle = (index / particles.length) * Math.PI * 2;
          const distance = 120 + (index % 7) * 18;

          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0.85, 0],
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                scale: [0.4, 1, 0.2],
              }}
              transition={{ duration: 1.05, delay: 0.1 + (index % 8) * 0.025, ease: 'easeOut' }}
            />
          );
        })}
      </div>

      <div className="time-transition-clock" aria-hidden="true">
        <motion.div
          className="time-transition-ring"
          initial={{ scale: 0.58, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 180, opacity: 1 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          {ticks.map((_, index) => (
            <span
              key={index}
              className={index % 5 === 0 ? 'time-transition-tick is-major' : 'time-transition-tick'}
              style={{ '--tick-angle': `${index * 6}deg` } as CSSProperties}
            />
          ))}
        </motion.div>

        <motion.span
          className="time-transition-hand time-transition-hand--long"
          initial={{ rotate: -40 }}
          animate={{ rotate: 1040 }}
          transition={{ duration: 1.12, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="time-transition-hand time-transition-hand--short"
          initial={{ rotate: 80 }}
          animate={{ rotate: 620 }}
          transition={{ duration: 1.12, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.span
          className="time-transition-core"
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: [0.55, 1.18, 1], opacity: 1 }}
          transition={{ duration: 0.72, delay: 0.16, ease: 'easeOut' }}
        />
      </div>

    </motion.div>
  );
}

export default App;
