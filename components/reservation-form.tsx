"use client";

import { Icon } from "@/components/icons";
import { useRef, useState } from "react";
import { availableTimes, maxDate, sampleTimes, singaporeNow, validateGuest, validateTable, type Reservation, type ReservationErrors } from "@/data/reservation";

const empty: Reservation = { date: "", time: "", partySize: "2", name: "", email: "", phone: "", notes: "" };
const stepNames = ["Table details", "Your details", "Review"];

export function ReservationForm() {
  const [values, setValues] = useState<Reservation>(empty);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const now = singaporeNow();
  const times = availableTimes(values.date, now);

  function update(field: keyof Reservation, value: string) {
    setValues(previous => ({ ...previous, [field]: value, ...(field === "date" ? { time: "" } : {}) }));
    setErrors(previous => ({ ...previous, [field]: undefined, ...(field === "date" ? { time: undefined } : {}) }));
  }
  function focusError(first: string | undefined) {
    if (first) window.setTimeout(() => document.getElementById(first)?.focus(), 0);
  }
  function next() {
    const found = step === 0 ? validateTable(values) : validateGuest(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) { focusError(first); return; }
    setStep(previous => previous + 1);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) { next(); return; }
    const table = validateTable(values);
    const guest = validateGuest(values);
    if (Object.keys(table).length) { setErrors(table); setStep(0); focusError(Object.keys(table)[0]); return; }
    if (Object.keys(guest).length) { setErrors(guest); setStep(1); focusError(Object.keys(guest)[0]); return; }
    setComplete(true);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  }
  function back() { setErrors({}); setStep(previous => previous - 1); window.setTimeout(() => headingRef.current?.focus(), 0); }

  return <div className="reservation-shell"><div className="reservation-steps" aria-label="Reservation progress">{stepNames.map((name, index) => <div key={name} className={index <= step ? "reservation-step current" : "reservation-step"}><span>0{index + 1}</span><span>{name}</span></div>)}</div>
    {complete ? <div className="reservation-complete" role="status"><span className="complete-star" aria-hidden="true"><Icon name="starburst" /></span><h2 ref={headingRef} tabIndex={-1}>A lovely evening,<br /><em>in imagination.</em></h2><p className="completion-lead">Demo reservation complete — no table has been booked.</p><p>This concept does not send, save, or confirm reservations. Your details remain only in this open page and disappear when you leave it.</p><button type="button" className="button button-dark" onClick={() => { setValues(empty); setComplete(false); setStep(0); setErrors({}); }}>Start again <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></button></div> :
    <form noValidate onSubmit={submit}><div className="reservation-form-content">{step === 0 && <><p className="eyebrow">01 / YOUR TABLE</p><h2 ref={headingRef} tabIndex={-1}>Make an evening of it.</h2><p className="form-intro">Choose a sample date and arrival time. These are demonstration options, not live table availability.</p>
      <div className="form-grid"><div className="form-field"><label htmlFor="date">Date <span>*</span></label><input id="date" name="date" type="date" min={now.date} max={maxDate(now.date)} value={values.date} onChange={event => update("date", event.target.value)} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "date-error" : "date-hint"} /><small id="date-hint">Tuesday–Sunday · next 90 days</small>{errors.date && <small id="date-error" className="field-error">{errors.date}</small>}</div>
      <div className="form-field"><label htmlFor="partySize">Party size <span>*</span></label><span className="select-control"><select id="partySize" name="partySize" value={values.partySize} onChange={event => update("partySize", event.target.value)} aria-invalid={Boolean(errors.partySize)} aria-describedby={errors.partySize ? "party-error" : undefined}>{Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "guest" : "guests"}</option>)}</select><Icon name="chevron-down" /></span>{errors.partySize && <small id="party-error" className="field-error">{errors.partySize}</small>}</div></div>
      <fieldset className="time-field" aria-describedby={errors.time ? "time-error" : "time-hint"}><legend>Arrival time <span>*</span></legend><p id="time-hint">Sample dinner arrivals, Singapore time.</p><div className="time-options">{sampleTimes.map(time => <label key={time} className={values.time === time ? "time-option selected" : "time-option"}><input type="radio" name="time" value={time} checked={values.time === time} disabled={!times.includes(time)} onChange={() => update("time", time)} />{time}</label>)}</div>{values.date && times.length === 0 && <p className="time-empty">No sample arrival times remain for this date. Please choose another day.</p>}{errors.time && <small id="time-error" className="field-error">{errors.time}</small>}</fieldset></>}
      {step === 1 && <><p className="eyebrow">02 / YOUR DETAILS</p><h2 ref={headingRef} tabIndex={-1}>Who’s coming to dinner?</h2><p className="form-intro">These details stay in this page only. Nothing is submitted to a restaurant.</p><div className="form-grid"><div className="form-field form-field-full"><label htmlFor="name">Full name <span>*</span></label><input id="name" name="name" autoComplete="name" value={values.name} onChange={event => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Your name" />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</div><div className="form-field"><label htmlFor="email">Email <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={event => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} placeholder="you@example.com" />{errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</div><div className="form-field"><label htmlFor="phone">Phone <span>*</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={event => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} placeholder="+65 8123 4567" />{errors.phone && <small id="phone-error" className="field-error">{errors.phone}</small>}</div><div className="form-field form-field-full"><label htmlFor="notes">Notes <span className="optional">optional</span></label><textarea id="notes" name="notes" rows={4} maxLength={501} value={values.notes} onChange={event => update("notes", event.target.value)} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : "notes-hint"} placeholder="Anything you would like us to know?" /><small id="notes-hint">{values.notes.length}/500 characters</small>{errors.notes && <small id="notes-error" className="field-error">{errors.notes}</small>}</div></div></>}
      {step === 2 && <><p className="eyebrow">03 / REVIEW</p><h2 ref={headingRef} tabIndex={-1}>Almost at the table.</h2><p className="form-intro">Review the demonstration details before completing the flow.</p><dl className="review-list"><div><dt>Date</dt><dd>{new Intl.DateTimeFormat("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${values.date}T00:00:00Z`))}</dd></div><div><dt>Arrival</dt><dd>{values.time} SGT</dd></div><div><dt>Guests</dt><dd>{values.partySize}</dd></div><div><dt>Name</dt><dd>{values.name}</dd></div><div><dt>Email</dt><dd>{values.email}</dd></div><div><dt>Phone</dt><dd>{values.phone}</dd></div>{values.notes && <div><dt>Notes</dt><dd>{values.notes}</dd></div>}</dl><p className="review-disclaimer">This is a portfolio demonstration. Completing it will not book a table or send these details anywhere.</p></>}
    </div><div className="reservation-actions">{step > 0 && <button type="button" className="back-button" onClick={back}><Icon name="arrow-left" /> Back</button>}{step < 2 ? <button key="continue" type="button" className="button button-dark" onClick={event => { event.preventDefault(); next(); }}>Continue <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></button> : <button key="complete" type="submit" className="button button-dark">Complete Demo <span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span></button>}</div></form>}
  </div>;
}
