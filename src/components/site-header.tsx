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
          <Link href="/learn">Learn</Link>
          <Link href="/creator/courses">Teach</Link>
          <Link href="#community">Community</Link>
          <Link href="#industry">For Industry</Link>
          <Link href="#platform">Platform</Link>
        </nav>

        <div className="premiumHeaderActions">
          <Link href="/sign-in" className="premiumSignIn">Sign in</Link>
          <Link href="/sign-up" className="premiumGetStarted">Get started</Link>
        </div>
      </div>
    </header>
  );
}
