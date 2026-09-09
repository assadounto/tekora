import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <Link href="/" className="brandMark">TEKORA</Link>
      <nav className="siteNav">
        <Link href="#learn">Learn</Link>
        <Link href="#build">Build</Link>
        <Link href="#connect">Connect</Link>
        <Link href="/sign-in">Sign in</Link>
        <Link href="/onboarding" className="headerCta">Join Tekora</Link>
      </nav>
    </header>
  );
}
