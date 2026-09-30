import { Icon } from "@/components/icons";
import { CreatorCredit } from "@/components/creator-credit";
import Link from "next/link";
import Image from "next/image";
import { gallery, navigation, site } from "@/data/site";

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={light ? "eyebrow eyebrow-light" : "eyebrow"}><span className="eyebrow-line" />{children}</p>;
}

export function TextLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link href={href} className={light ? "text-link text-link-light" : "text-link"}>{children} <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link>;
}

export function PageIntro({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return <section className="page-intro wrap"><Eyebrow>{kicker}</Eyebrow><div className="page-intro-grid"><h1 className="display-title">{title}</h1><p className="lead-copy">{lead}</p></div></section>;
}

export function BookingInvitation({ label = "Your evening begins here." }: { label?: string }) {
  return <section className="booking-invitation"><div className="wrap booking-invitation-inner"><Eyebrow light>THE TABLE IS YOURS</Eyebrow><h2 data-reveal="text">{label}</h2><p>Come hungry. Leave a little later than planned.</p><Link className="button button-cream" href="/reservation">Book a Table <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link><p className="demo-line">Concept project · Booking flow demonstration</p></div></section>;
}

export function Footer() {
  return <footer className="footer"><div className="wrap"><div className="footer-top"><div><p className="footer-mark">EMBER<span>.</span></p><p className="footer-tagline">{site.line}</p></div><div className="footer-visit"><span className="footer-label">THE EVENING</span><p>{site.hours}<br />{site.location}</p></div></div><CreatorCredit /><div className="footer-bottom"><nav aria-label="Footer navigation">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/reservation">Reservations</Link></nav><p>© {new Date().getFullYear()} EMBER · Concept Project</p></div><p className="footer-disclosure">{site.conceptNote} All food, people, and spaces pictured are AI-generated concept imagery. Menu and hours are illustrative.</p></div></footer>;
}

export function FeatureImage({ image, className = "", priority = false, reveal = true, sizes = "(max-width: 768px) 100vw, 50vw" }: { image: (typeof gallery)[number]; className?: string; priority?: boolean; reveal?: boolean; sizes?: string }) {
  return <div className={`image-frame ${className}`} data-reveal={reveal ? "image" : undefined}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority={priority} sizes={sizes} /></div>;
}
