"use client";

import { Icon } from "@/components/icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gallery, type GalleryCategory } from "@/data/site";

const filters = ["All", "Food", "Space", "Craft"] as const;
type Filter = "All" | GalleryCategory;

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const visible = gallery.filter(item => filter === "All" || item.category === filter);
  const activeImage = active === null ? null : visible[active];
  const isOpen = active !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive(index => index === null ? null : (index + 1) % visible.length);
      if (event.key === "ArrowLeft") setActive(index => index === null ? null : (index - 1 + visible.length) % visible.length);
      if (event.key === "Tab") {
        const controls = Array.from(document.querySelectorAll<HTMLButtonElement>(".lightbox button"));
        if (controls.length === 0) return;
        const index = controls.indexOf(document.activeElement as HTMLButtonElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); controls[controls.length - 1].focus(); }
        else if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); controls[0].focus(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); triggerRef.current?.focus(); };
  }, [isOpen, visible.length]);

  return <section className="gallery-section wrap" aria-label="Image gallery"><div className="gallery-filters" role="group" aria-label="Filter gallery">{filters.map(option => <button key={option} type="button" aria-pressed={filter === option} className={filter === option ? "filter-button active" : "filter-button"} onClick={() => { setFilter(option); setActive(null); }}>{option}</button>)}</div>
    <div className="gallery-grid">{visible.map((item, index) => <button className={`gallery-tile tile-${index}`} type="button" key={item.src} onClick={event => { triggerRef.current = event.currentTarget; setActive(index); }} aria-label={`View ${item.caption}`}><Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 768px) 100vw, 50vw" /><span className="gallery-caption"><span>{item.category}</span><strong>{item.caption}</strong><span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></span></button>)}</div>
    {activeImage && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${activeImage.caption}, image ${active! + 1} of ${visible.length}`}><div className="lightbox-backdrop" onClick={() => setActive(null)} /><div className="lightbox-panel"><button ref={closeRef} className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Close image"><Icon name="close" /></button><Image src={activeImage.src} alt={activeImage.alt} width={activeImage.width} height={activeImage.height} sizes="90vw" /><div className="lightbox-bottom"><button type="button" onClick={() => setActive(index => index === null ? null : (index - 1 + visible.length) % visible.length)} aria-label="Previous image"><Icon name="arrow-left" /></button><p>{activeImage.caption}<span>{active! + 1} / {visible.length}</span></p><button type="button" onClick={() => setActive(index => index === null ? null : (index + 1) % visible.length)} aria-label="Next image"><Icon name="arrow-right" /></button></div></div></div>}
  </section>;
}
