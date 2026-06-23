import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { experiences, openingFragments, profile, projects, selfReview, skillGroups } from './data/siteContent';

const titleFragments = [
  { text: '或许，', x: -64, y: -28, rotate: -8 },
  { text: '我们只是', x: 56, y: -42, rotate: 6 },
  { text: '差了一些', x: -48, y: 38, rotate: 8 },
  { text: '运气和机会。', x: 68, y: 30, rotate: -6 },
];

function App() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="fragment-cloud" aria-hidden="true">
            {openingFragments.map((fragment, index) => (
              <span key={fragment} style={{ '--fragment-index': index } as CSSProperties}>
                {fragment}
              </span>
            ))}
          </div>
          <p className="eyebrow">Resume / Full-stack Frontend</p>
          <h1>{profile.name}</h1>
          <p className="hero-subtitle">{profile.title}</p>
          <p className="hero-summary">
            多年企业级中后台系统开发经验，熟悉 OA、供应链、WMS、营销数据平台、智能工单等业务场景。
            现在更关注前端工程化、全栈协作，以及 AI 能力如何真正落到业务流程里。
          </p>
        </div>

        <aside className="opening-card" aria-label="开场文字">
          <span className="panel-label">Opening</span>
          <h2 className="assembled-title" aria-label="或许，我们只是差了一些运气和机会。">
            {titleFragments.map((fragment, index) => (
              <motion.span
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  x: fragment.x,
                  y: fragment.y,
                  rotate: fragment.rotate,
                  filter: 'blur(10px)',
                }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.38 + index * 0.14,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                key={fragment.text}
              >
                {fragment.text}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.12, duration: 0.65, ease: 'easeOut' }}
          >
            我把问题拆开，把页面和系统慢慢做出来，也把每一次练习留在代码里。
          </motion.p>
        </aside>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2>专业技能</h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article className="quiet-card" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>工作经历</h2>
        </div>
        <div className="timeline-list">
          {experiences.map((item) => (
            <article className="timeline-item" key={`${item.company}-${item.period}`}>
              <div>
                <span>{item.period}</span>
                <strong>{item.role}</strong>
              </div>
              <div>
                <p className="project-type">{item.company}</p>
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
          <h2>项目经历</h2>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div>
                <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                <p className="project-type">
                  {project.role} / {project.period}
                </p>
                <h3>{project.title}</h3>
                <p>{project.intro}</p>
              </div>
              <div className="project-meta">
                <div className="project-note">
                  <span>技术栈</span>
                  <p>{project.stack}</p>
                </div>
                <ul>
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Education</p>
          <h2>教育背景与自我评价</h2>
        </div>
        <div className="education-layout">
          <article className="quiet-card">
            <h3>{profile.school}</h3>
            <p>
              {profile.major} / {profile.education}
            </p>
          </article>
          <article className="quiet-card">
            <h3>自我评价</h3>
            <ul className="review-list">
              {selfReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;
