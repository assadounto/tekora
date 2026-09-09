const items = [
  ["Continue learning", "Embedded Systems Foundations", "68%"],
  ["Current project", "IoT Transformer Health Monitor", "4 / 8 stages"],
  ["Your circle", "ATU Embedded Builders", "12 members"],
  ["Skill evidence", "Arduino & Embedded Systems", "Intermediate"],
];

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <p className="eyebrow">TEKORA</p>
      <h1>Your learning command center</h1>
      <p className="muted">Learn, build with others, collect evidence and turn your skills into opportunities.</p>
      <section className="dashboardGrid">
        {items.map(([label, title, meta]) => (
          <article className="panel" key={label}>
            <small>{label}</small>
            <h2>{title}</h2>
            <p>{meta}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
