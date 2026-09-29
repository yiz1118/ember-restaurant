import { Icon } from "@/components/icons";
import Link from "next/link";
export default function NotFound() { return <main id="main" className="not-found wrap"><p className="eyebrow">404 / A WRONG TURN</p><h1>This isn’t<br /><em>your table.</em></h1><p>That page could not be found. There is always a way back to the warmth.</p><Link className="button button-dark" href="/">Return Home <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></Link></main>; }
