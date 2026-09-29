import type { Metadata } from "next";
import { PageIntro } from "@/components/shared";
import { ReservationForm } from "@/components/reservation-form";

export const metadata: Metadata = { title: "Book a Table · Demo", description: "Explore EMBER's polished reservation flow demonstration. No real booking is made." };
export default function ReservationPage() {
  return <main id="main"><PageIntro kicker="YOUR EVENING · DEMO ONLY" title="Save a seat for the story." lead="Experience a considered booking flow for the imagined EMBER dining room. This demonstration never books a real table." /><section className="reservation-section wrap"><ReservationForm /><aside className="reservation-aside"><p className="small-label">BEFORE YOU ARRIVE</p><h2>Good evenings<br /><em>begin slowly.</em></h2><p>Dinner is imagined for Tuesday through Sunday, 18:00–22:30. Allow time for one more course, or one more conversation.</p><div className="reservation-aside-rule" /><p className="small-label">PLEASE NOTE</p><p>EMBER is a fictional concept. Dates, times, menu, and contact details are illustrative only.</p></aside></section></main>;
}
