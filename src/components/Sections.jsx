import { aiml, swe, experience, education, skills, contact, emailParts } from '../data/content';
import Rich from '../lib/Rich';
import Section from './Section';
import { ProjectGroup, ToolList } from './Projects';
import { CalendarIcon, CheckIcon } from './icons';
import { GitHubButton, LinkedInButton } from './Social';

export function AiMl() {
  return (
    <Section id="ai-ml" alt title={aiml.title}>
      <p className="lede">{aiml.lede}</p>
      {aiml.groups.map((g) => (
        <ProjectGroup key={g.title} {...g} />
      ))}
    </Section>
  );
}

export function Swe() {
  return (
    <Section id="swe" title={swe.title}>
      <p className="lede">{swe.lede}</p>
      <ProjectGroup {...swe.apps} />
      <ToolList {...swe.tools} />
    </Section>
  );
}

function When({ children }) {
  return (
    <span className="when">
      <CalendarIcon />
      {children}
    </span>
  );
}

export function Experience() {
  return (
    <Section id="experience" alt title={experience.title}>
      {experience.jobs.map((j) => (
        <div className="job" key={j.title}>
          <div>
            <h3>{j.title}</h3>
            <div className="org">{j.org}</div>
            <div className="when-row">
              <When>{j.when}</When>
            </div>
            <div className="where">{j.where}</div>
            <ul>
              {j.bullets.map((b, i) => (
                <li key={i}>
                  <Rich text={b} />
                </li>
              ))}
            </ul>
            {j.courses && (
              <div className="chips course-chips">
                <em>Courses</em>
                {j.courses.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" title={education.title}>
      {education.items.map((e) => (
        <div className="job" key={e.title}>
          <div>
            <h3>{e.title}</h3>
            <div className="org">{e.org}</div>
            <div className="when-row">
              <When>{e.when}</When>
              {e.graduated && (
                <span className="grad">
                  <CheckIcon />
                  Graduated
                </span>
              )}
              {e.gpa && (
                <div className="gpa">
                  <span>GPA</span>
                  {e.gpa}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" alt title={skills.title}>
      <div className="skill-grid">
        {skills.cards.map((c) => (
          <div className={`skill-card ${c.cls}`} key={c.cls}>
            <h3>{c.title}</h3>
            <ul>
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

// The mailto link is built on hover/focus/touch/click, so the address is never in the markup.
function EmailButton() {
  const build = () => `mailto:${emailParts.user}@${emailParts.domain}`;
  const arm = (e) => {
    e.currentTarget.href = build();
  };
  return (
    <a
      className="btn primary"
      href="#contact"
      onPointerEnter={arm}
      onFocus={arm}
      onTouchStart={arm}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = build();
      }}
    >
      Email me
    </a>
  );
}

export function Contact() {
  return (
    <Section id="contact" className="contact" title={contact.title}>
      <p className="statement">{contact.statement}</p>
      <p className="lede" style={{ marginTop: '12px' }}>
        {contact.lede}
      </p>
      <div className="actions">
        <EmailButton />
        <LinkedInButton />
        <GitHubButton />
      </div>
    </Section>
  );
}
