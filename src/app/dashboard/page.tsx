import Link from "next/link";

const items = [
  ["Continue learning", "Embedded Systems Foundations", "68%"],
  ["Current project", "IoT Transformer Health Monitor", "4 / 8 stages"],
  ["Your circle", "ATU Embedded Builders", "12 members"],
  ["Skill evidence", "Arduino & Embedded Systems", "Intermediate"],
];

const nav = ["Home", "Learn", "Projects", "Circles", "People", "Portfolio"];

export default function DashboardPage() {
  return (
    <main className="appShell">
      <aside className="sidebar">
        <Link href="/" className="brandMark">TEKORA</Link>
        <nav>
          {nav.map((item, index) => (
            <a className={index === 0 ? "activeNav" : ""} href="#" key={item}>{item}</a>
          ))}
        </nav>
        <div className="sidebarFooter">
          <span className="avatar">RA</span>
          <div><strong>Richmond</strong><small>Learner</small></div>
        </div>
      </aside>

      <section className="dashboardMain">
        <header className="dashboardTopbar">
          <div>
            <p className="eyebrow">YOUR TEKORA</p>
            <h1>Good to see you building.</h1>
          </div>
          <Link href="/onboarding" className="headerCta">Update path</Link>
        </header>

        <section className="dashboardGrid">
          {items.map(([label, title, meta]) => (
            <article className="panel" key={label}>
              <small>{label}</small>
              <h2>{title}</h2>
              <p>{meta}</p>
            </article>
          ))}
        </section>

        <section className="dashboardSection">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">PEOPLE ON YOUR PATH</p>
              <h2>Meet people learning what you&apos;re learning.</h2>
            </div>
            <button>Explore people</button>
          </div>

          <div className="peopleRow">
            {[
              ["AK", "Ama K.", "Computer Engineering · IoT", "82% match"],
              ["KM", "Kojo M.", "Electrical Engineering · Solar", "78% match"],
              ["EN", "Esi N.", "Software Engineering · React", "74% match"],
            ].map(([initials, name, field, match]) => (
              <article className="personCard" key={name}>
                <span className="largeAvatar">{initials}</span>
                <h3>{name}</h3>
                <p>{field}</p>
                <strong>{match}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}