export const sampleTimes = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"] as const;
export type Reservation = { date: string; time: string; partySize: string; name: string; email: string; phone: string; notes: string };
export type ReservationErrors = Partial<Record<keyof Reservation, string>>;

export function singaporeNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? "00";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

export function maxDate(today: string) {
  const [year, month, day] = today.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 90)).toISOString().slice(0, 10);
}

export function isClosedMonday(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.toISOString().slice(0, 10) === date && parsed.getUTCDay() === 1;
}

export function availableTimes(date: string, now = singaporeNow()) {
  if (!date || isClosedMonday(date) || date < now.date || date > maxDate(now.date)) return [];
  return sampleTimes.filter(time => date !== now.date || time > now.time);
}

export function validateTable(values: Reservation, now = singaporeNow()): ReservationErrors {
  const errors: ReservationErrors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || values.date < now.date || values.date > maxDate(now.date)) errors.date = "Choose a date within the next 90 days.";
  else if (isClosedMonday(values.date)) errors.date = "Our sample dinner service is closed on Mondays.";
  if (!sampleTimes.some(time => time === values.time) || !availableTimes(values.date, now).includes(values.time as typeof sampleTimes[number])) errors.time = "Choose an available sample arrival time.";
  if (!/^[1-8]$/.test(values.partySize)) errors.partySize = "Choose a party size from 1 to 8.";
  return errors;
}

export function validateGuest(values: Reservation): ReservationErrors {
  const errors: ReservationErrors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (values.phone.replace(/\D/g, "").length < 8 || values.phone.replace(/\D/g, "").length > 15) errors.phone = "Enter a phone number with 8 to 15 digits.";
  if (values.notes.length > 500) errors.notes = "Keep notes under 500 characters.";
  return errors;
}
