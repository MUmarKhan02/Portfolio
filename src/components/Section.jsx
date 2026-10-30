// Every section is <section><div class="wrap split">…</div></section>.
// Children go straight into the grid, so don't wrap them in extra elements.
export default function Section({ id, alt, className, title, children }) {
  const cls = [alt && 'alt', className].filter(Boolean).join(' ') || undefined;
  return (
    <section id={id} className={cls}>
      <div className="wrap split">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
