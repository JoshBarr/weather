const formatter = new Intl.DateTimeFormat("en-us", {
  timeStyle: "short",
  hour12: true,
});

export function formatHours(time: string) {
  return formatter.format(new Date(time));
}
