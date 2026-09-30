"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let additions: MutationObserver | undefined;

    function show(element: HTMLElement) {
      element.classList.add("is-visible");
      observer?.unobserve(element);
    }

    function register(root: Element, newlyAdded = false) {
      const candidates = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) candidates.unshift(root);
      candidates.forEach(element => {
        if (elements.has(element)) return;
        elements.add(element);
        const bounds = element.getBoundingClientRect();
        // Never hide content already read or in the first viewport during hydration.
        if (bounds.bottom <= 0 || (!newlyAdded && bounds.top < window.innerHeight)) {
          show(element);
        } else {
          element.classList.add("will-reveal");
          observer?.observe(element);
        }
      });
    }

    function stop() {
      observer?.disconnect();
      additions?.disconnect();
      elements.forEach(element => element.classList.remove("will-reveal", "is-visible"));
      elements.clear();
    }

    function start() {
      stop();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) show(entry.target as HTMLElement); });
      }, { threshold: 0, rootMargin: "0px 0px 64px 0px" });
      register(document.body);
      // Route streaming and filtered gallery results use the same primitives.
      additions = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node instanceof Element) register(node, true);
        }));
        // Do not retain removed gallery nodes after repeated filtering.
        elements.forEach(element => {
          if (!element.isConnected) { observer?.unobserve(element); elements.delete(element); }
        });
      });
      additions.observe(document.body, { childList: true, subtree: true });
    }

    function onFocus(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-reveal]");
      if (element) { element.classList.remove("will-reveal"); show(element); }
    }

    start();
    preference.addEventListener("change", start);
    document.addEventListener("focusin", onFocus);
    return () => {
      stop();
      preference.removeEventListener("change", start);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);
  return null;
}
