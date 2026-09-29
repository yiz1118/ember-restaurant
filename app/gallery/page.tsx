import type { Metadata } from "next";
import { PageIntro, BookingInvitation } from "@/components/shared";
import { Gallery } from "@/components/gallery";

export const metadata: Metadata = { title: "Gallery", description: "Explore the food, craft and atmosphere of the fictional EMBER restaurant concept." };
export default function GalleryPage() {
  return <main id="main"><PageIntro kicker="THE GALLERY · GENERATED IMAGERY" title="A closer look at the evening." lead="A visual journey through the imagined room, the plates, and the moments in between. All photography is AI-generated for this concept." /><Gallery /><BookingInvitation /></main>;
}
