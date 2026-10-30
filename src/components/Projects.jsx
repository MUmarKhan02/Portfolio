import Rich from '../lib/Rich';

export function LinkList({ links }) {
  return (
    <div className="links">
      {links.map((l) => (
        <a key={l.href} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {l.label}
        </a>
      ))}
    </div>
  );
}

export function Project({ p }) {
  return (
    <article className="project">
      <h3>{p.title}</h3>
      <div className="where">{p.where}</div>
      <p className="desc">
        <Rich text={p.desc} />
      </p>
      {p.note && (
        <p className="note" style={{ marginTop: '14px' }}>
          {p.note}
        </p>
      )}
      <div className="chips">
        {p.chips.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <LinkList links={p.links} />
    </article>
  );
}

// A labelled group: "Research and coursework — Honours, group, and course projects" + its projects.
export function ProjectGroup({ title, note, projects }) {
  return (
    <>
      <div className="sub">
        {title}
        <span>{note}</span>
      </div>
      <div className="projects">
        {projects.map((p) => (
          <Project key={p.title} p={p} />
        ))}
      </div>
    </>
  );
}

export function ToolList({ title, note, rows }) {
  return (
    <>
      <div className="sub">
        {title}
        <span>{note}</span>
      </div>
      <div className="list">
        {rows.map((r) => (
          <div className="row" key={r.title}>
            <h3>{r.title}</h3>
            <div>
              <p>{r.text}</p>
              <div className="meta">
                {r.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
            <LinkList links={r.links} />
          </div>
        ))}
      </div>
    </>
  );
}
