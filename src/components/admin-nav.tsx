"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["OV", "Overview", "/admin"],
  ["PR", "Projects", "/admin/projects"],
  ["CR", "Courses", "/admin/courses"],
  ["RQ", "Project Requests", "/admin/project-requests"],
  ["US", "Users", "/admin/users"],
  ["GH", "Sales", "/admin/sales"],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="adminNav" aria-label="Admin navigation">
      {items.map(([icon, label, href]) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return <Link className={active ? "active" : ""} href={href} key={href}><span>{icon}</span><strong>{label}</strong></Link>;
      })}
    </nav>
  );
}
