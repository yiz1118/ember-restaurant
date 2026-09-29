import type { SVGProps } from "react";

type IconName = "arrow-up-right" | "arrow-right" | "arrow-left" | "chevron-down" | "close" | "menu" | "starburst";
const paths: Record<IconName, string> = {
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "arrow-right": "M4 12h16M14 6l6 6-6 6",
  "arrow-left": "M20 12H4M10 6l-6 6 6 6",
  "chevron-down": "m6 9 6 6 6-6",
  close: "m6 6 12 12M18 6 6 18",
  menu: "M1 8h22M1 16h22",
  starburst: "M12 2v20M2 12h20M5 5l14 14M19 5 5 19",
};

// Every use is decorative; icon-only controls supply their name on the button.
export function Icon({ name, className = "", ...props }: Omit<SVGProps<SVGSVGElement>, "name" | "children"> & { name: IconName }) {
  return <svg {...props} className={`ui-icon ${className}`.trim()} data-icon={name} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
