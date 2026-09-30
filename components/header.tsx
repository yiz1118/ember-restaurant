"use client";

import { Icon } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { navigation } from "@/data/site";

const mobileQuery = "(max-width: 850px)";
function subscribeMobile(listener: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const isMobile = () => window.matchMedia(mobileQuery).matches;
const serverMobile = () => false;

export function Header() {
  const pathname = usePathname();
  return <HeaderContent key={pathname} pathname={pathname} />;
}

function HeaderContent({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, serverMobile);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return <>
    <header className="site-header">
      <div className="concept-strip">CONCEPT PROJECT <span aria-hidden="true">·</span> FICTIONAL RESTAURANT</div>
      <div className="header-inner wrap">
        <Link href="/" className="wordmark" aria-label="EMBER, home">EMBER<span className="wordmark-dot">.</span></Link>
        <nav aria-label="Main navigation" className={open ? "nav-links is-open" : "nav-links"} id="main-nav" inert={mobile && !open} aria-hidden={mobile && !open ? true : undefined}>
          {navigation.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link is-active" : "nav-link"} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
          <Link href="/reservation" className="nav-book-mobile" aria-current={pathname === "/reservation" ? "page" : undefined}>Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>
        </nav>
        <Link href="/reservation" className="header-book">Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><span className="menu-toggle-symbol" aria-hidden="true"><Icon name="menu" /><Icon name="close" /></span></button>
      </div>
      {pathname !== "/reservation" && <Link href="/reservation" className="mobile-book-bar">Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>}
    </header>
  </>;
}
