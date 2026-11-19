/** The day of the week asked for in a query string as `?day=1` (Monday) to `?day=7` (Sunday), or null. */
export function dayFromQuery(
  /** A query string, such as `location.search` */
  search: string,
) {
  const day = Number(new URLSearchParams(search).get("day"))
  return Number.isInteger(day) && day >= 1 && day <= 7 ? day : null
}
