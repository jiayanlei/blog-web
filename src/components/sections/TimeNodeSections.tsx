import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import NodeHeader from '../cosmic/NodeHeader';
import MagicBento from '../reactbits/MagicBento';
import MagnetLink from '../reactbits/MagnetLink';
import ShinyText from '../reactbits/ShinyText';
import SplitRevealText from '../reactbits/SplitRevealText';
import SpotlightCard from '../reactbits/SpotlightCard';
import { archiveBlueprint, highlights, projects, reactBitsPlan, skills } from '../../data/siteContent';
import type { TimeNodeId } from '../../data/siteContent';

export function TimeNodeContent({ nodeId }: { nodeId: TimeNodeId }) {
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
  return (
    <div className="hero-copy">
      <p className="hero-kicker">Time Relic / Cosmic Portfolio</p>
      <h1 id="origin-title" className="hero-title">
        <ShinyText className="hero-title-text" speed={4.6}>
          <SplitRevealText text="或许，我们只是差了一些运气和机会。" />
        </ShinyText>
      </h1>
      <p>但时间，会把答案交给坚持的人。</p>
      <div className="reactbits-plan-strip" aria-label="React Bits 引入计划">
        {reactBitsPlan.map((item) => (
          <span key={item.label}>
            <strong>{item.label}</strong>
            {item.value}
          </span>
        ))}
      </div>
      <div className="archive-blueprint" aria-label="Time Archive 博客蓝图">
        <strong>Archive Blueprint</strong>
        <span>{archiveBlueprint.length} 篇时间档案已规划</span>
      </div>
    </div>
  );
}

function AboutNode() {
  return (
    <div className="node-layout">
      <NodeHeader
        id="about-title"
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
          <SpotlightCard className="signal-card" key={label} intensity="rgba(147, 197, 253, 0.13)">
            <span>{label}</span>
            <strong>{value}</strong>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}

function StackNode() {
  return (
    <div className="node-layout node-layout--center">
      <NodeHeader
        id="stack-title"
        eyebrow="Time Orbit"
        title="技术栈"
        description="能力像陨石碎片散落在时间轨道中，围绕真实问题慢慢形成自己的引力。"
        align="center"
      />
      <div className="skill-orbit" aria-label="技术栈">
        <div className="skill-orbit-core" aria-hidden="true" />
        {[1, 2, 3, 4, 5].map((orbit) => (
          <span className={`skill-orbit-ring skill-orbit-ring--${orbit}`} key={orbit} aria-hidden="true" />
        ))}
        {skills.map((skill, index) => (
          <span
            className={`skill-orbit-path skill-orbit-path--${skill.orbit}${skill.reverse ? ' is-reverse' : ''}`}
            key={skill.name}
            style={
              {
                '--skill-index': index,
                '--skill-angle-start': `${skill.angle}deg`,
                '--skill-speed': `${skill.speed}s`,
                '--skill-depth': skill.depth,
              } as CSSProperties
            }
          >
            <span className="skill-meteor">
              <span className="skill-meteor-rock" aria-hidden="true" />
              <span className="skill-meteor-label">{skill.name}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsNode() {
  return (
    <div className="node-layout node-layout--wide">
      <NodeHeader
        id="projects-title"
        eyebrow="Time Archive"
        title="项目作品"
        description="像从钟面中抽出的时间档案，记录那些被真实需求推动过的系统片段。"
        align="center"
      />
      <div className="project-grid">
        {projects.map((project) => (
          <SpotlightCard className="project-card" key={project.title}>
            <div className="project-head">
              <div>
                <p>{project.tag}</p>
                <h3>{project.title}</h3>
              </div>
            </div>
            <p className="project-intro">{project.intro}</p>
            <div className="project-abilities">
              {project.abilities.map((ability) => (
                <span key={ability}>{ability}</span>
              ))}
            </div>
            <div className="project-stack">
              {project.stack.map((stack) => (
                <span key={stack}>{stack}</span>
              ))}
            </div>
            <div className="project-highlights">
              {project.highlights.map((highlight) => (
                <strong key={highlight}>{highlight}</strong>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}

function HighlightsNode() {
  return (
    <div className="node-layout node-layout--wide">
      <NodeHeader
        id="highlights-title"
        eyebrow="AI Fragment"
        title="AI 能力"
        description="让未来感留在能力里，让视觉仍然属于这座安静运转的古老时钟。"
        align="center"
      />
      <MagicBento items={highlights} />
    </div>
  );
}

function ContactNode() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="node-layout node-layout--split">
      <div>
        <NodeHeader
          id="contact-title"
          eyebrow="Last Fragment"
          title="如果时间刚好"
          description="我们可以一起做点有意思的东西。"
        />
        <p className="copyright">© {currentYear} 贾岩磊. AI Full Stack Engineer Cockpit.</p>
      </div>
      <div className="contact-panel">
        <ContactLink label="contact@example.com" href="mailto:contact@example.com" />
        <ContactLink label="GitHub / Project Space" href="https://github.com/" external />
        <ContactLink label="下载简历" href="/resume.pdf" />
      </div>
    </div>
  );
}

function ContactLink({ label, href, external = false }: { label: string; href: string; external?: boolean }) {
  return (
    <MagnetLink href={href} external={external}>
      <span>{label}</span>
      <small aria-hidden="true">↗</small>
    </MagnetLink>
  );
}
