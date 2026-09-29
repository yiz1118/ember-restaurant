"use client";

import { Icon } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  return <HeaderContent key={pathname} pathname={pathname} />;
}

function HeaderContent({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return <>
    <header className="site-header">
      <div className="concept-strip">CONCEPT PROJECT <span aria-hidden="true">·</span> FICTIONAL RESTAURANT</div>
      <div className="header-inner wrap">
        <Link href="/" className="wordmark" aria-label="EMBER, home">EMBER<span className="wordmark-dot">.</span></Link>
        <nav aria-label="Main navigation" className={open ? "nav-links is-open" : "nav-links"} id="main-nav">
          {navigation.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link is-active" : "nav-link"} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
          <Link href="/reservation" className="nav-book-mobile" aria-current={pathname === "/reservation" ? "page" : undefined}>Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>
        </nav>
        <Link href="/reservation" className="header-book">Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      </div>
      {pathname !== "/reservation" && <Link href="/reservation" className="mobile-book-bar">Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>}
    </header>
  </>;
}
