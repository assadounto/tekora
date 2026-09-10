import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="premiumHeader">
      <div className="premiumHeaderInner">
        <Link href="/" className="premiumBrand" aria-label="Tekora home">
          <span className="premiumBrandIcon">T</span>
          <span>Tekora</span>
        </Link>

        <nav className="premiumNav" aria-label="Primary navigation">
          <Link href="/projects">Projects</Link>
          <Link href="/projects/my">My Projects</Link>
          <Link href="/projects#catalog">Project Kits</Link>
          <Link href="/projects/request">Request a Project</Link>
          <Link href="/learn">Learn</Link>
        </nav>

        <div className="premiumHeaderActions">
          <Link href="/sign-in" className="premiumSignIn">Sign in</Link>
          <Link href="/sign-up" className="premiumGetStarted">Get started</Link>
        </div>
      </div>
    </header>
  );
}
