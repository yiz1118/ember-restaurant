export const site = {
  name: "EMBER",
  line: "Seasonal ingredients. Open fire. Unhurried evenings.",
  hours: "Tuesday–Sunday · 18:00–22:30",
  location: "Singapore · a fictional setting",
  conceptNote: "A fictional restaurant concept created for a design and development portfolio.",
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/story", label: "Our Story" },
  { href: "/chef", label: "The Chef" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Visit" },
] as const;

export type GalleryCategory = "Food" | "Space" | "Craft";
export type GalleryImage = { src: string; alt: string; caption: string; category: GalleryCategory; width: number; height: number };
export const gallery: GalleryImage[] = [
  { src: "/images/hearth.webp", alt: "Glowing open hearth in a dark, intimate dining room", caption: "The hearth at the center of the room", category: "Space", width: 1672, height: 941 },
  { src: "/images/mushrooms.webp", alt: "Charred oyster mushrooms with herbs on handmade ceramic", caption: "Fire-roasted oyster mushrooms", category: "Food", width: 1024, height: 1536 },
  { src: "/images/sea-bream.webp", alt: "Grilled whole sea bream with charred lemon and fennel", caption: "Sea bream, brown butter, fennel", category: "Food", width: 1024, height: 1536 },
  { src: "/images/dining-room.webp", alt: "Warm dining room at dusk overlooking a fictional city", caption: "A room made for long evenings", category: "Space", width: 1536, height: 1024 },
  { src: "/images/chef.webp", alt: "Fictional chef beside a glowing kitchen hearth", caption: "Chef Mara Tan — fictional profile", category: "Craft", width: 1024, height: 1536 },
  { src: "/images/seasonal.webp", alt: "Hands finishing a bowl of heirloom tomatoes beside the fire", caption: "The final touch, just before service", category: "Craft", width: 1536, height: 1024 },
];
