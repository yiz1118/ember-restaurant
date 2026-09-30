import type { Metadata } from "next";
import { BookingInvitation, Eyebrow, FeatureImage, PageIntro, TextLink } from "@/components/shared";
import { gallery } from "@/data/site";

export const metadata: Metadata = { title: "Our Story", description: "The fictional story and live-fire philosophy behind EMBER." };
export default function StoryPage() {
  return <main id="main"><PageIntro kicker="OUR STORY · A CONCEPT" title="Good things take their time." lead="EMBER began as a simple idea: make space for the ingredient, the fire, and the people gathered around it." />
    <section className="story-hero wrap"><FeatureImage image={gallery[0]} sizes="100vw" /><span className="image-credit">01 / THE HEARTH</span></section>
    <section className="story-statement section-pad wrap"><Eyebrow>THE IDEA</Eyebrow><h2 data-reveal="text">It starts with a flame.<br /><em>It ends with a feeling.</em></h2><div><p>In this imagined dining room, the open hearth is more than a way to cook. It is a rhythm: patient heat, a little smoke, and the instinct to gather close.</p><p>Our menu follows the season rather than a fixed script. Vegetables get as much care as seafood and meat. Each plate aims to leave a clear memory of the ingredient at its heart.</p></div></section>
    <section className="story-split section-pad"><div className="wrap story-split-grid"><FeatureImage image={gallery[5]} /><div className="story-split-copy"><Eyebrow>THE APPROACH</Eyebrow><h2 className="section-title" data-reveal="text">Seasonal by nature.<br /><em>Simple by choice.</em></h2><p>The best produce asks for confidence and restraint. A tomato warmed by the grill. Fish turned over coals. Herbs added at the last moment. Nothing more than the dish needs.</p><TextLink href="/menu">See it on the menu</TextLink></div></div></section>
    <section className="story-room wrap section-pad"><div><Eyebrow>THE ROOM</Eyebrow><h2 className="section-title" data-reveal="text">A table to<br /><em>return to.</em></h2><p>EMBER is imagined as an intimate place for conversation: soft light, warm surfaces, and service that knows when to step back.</p></div><FeatureImage image={gallery[3]} /></section><BookingInvitation /></main>;
}
