import { Icon } from "@/components/icons";
import type { Metadata } from "next";
import { BookingInvitation, Eyebrow, PageIntro } from "@/components/shared";
import { menu } from "@/data/menu";

export const metadata: Metadata = { title: "The Menu", description: "Explore EMBER's illustrative live-fire menu of seasonal plates, grill dishes and drinks." };
export default function MenuPage() {
  return <main id="main"><PageIntro kicker="THE MENU · A CONCEPT" title="An invitation to linger." lead="A sample menu shaped by season, sharpened by flame, and made for the pleasure of sharing. All items and prices are illustrative." />
    <div className="menu-anchor-wrap"><nav className="wrap menu-anchors" aria-label="Menu categories">{menu.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav></div>
    <div className="wrap menu-layout"><aside className="menu-aside"><span className="small-label">A NOTE FROM THE HEARTH</span><p>Begin somewhere. Pass plates around. Find a reason to stay for dessert.</p><span className="menu-aside-mark" aria-hidden="true"><Icon name="starburst" /></span></aside><div className="menu-sections">{menu.map((section, index) => <section id={section.id} className="menu-section" key={section.id}><div className="menu-section-head"><Eyebrow>0{index+1} / {section.note.toUpperCase()}</Eyebrow><h2>{section.title}</h2></div><div className="menu-items" data-reveal="stagger">{section.items.map(item => <div className="menu-item" key={item.name}><div><h3>{item.name}</h3><p>{item.description}</p>{item.dietary && <span className="diet-label">{item.dietary}</span>}</div><span className="menu-price"><span className="currency">S$</span>{item.price}</span></div>)}</div></section>)}</div></div>
    <p className="wrap menu-note">Prices in SGD. Menu, dietary labels and service details are illustrative; a real restaurant would verify ingredients and allergens before publication.</p><BookingInvitation label="The best seat is waiting." /></main>;
}
