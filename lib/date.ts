const timeZone = "Asia/Jakarta";

export function formatLocal(date: Date | string, timezone: string = timeZone) {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}
