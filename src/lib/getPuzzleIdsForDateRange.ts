import type { LocalDate } from "@js-joda/core"
import type { NytArchivePuzzle } from "@/types.ts"
import { fetchNyt } from "./fetchNyt.ts"

/** Gets the IDs of all daily NYT crosswords published in a date range of at most 31 days. */
export async function getPuzzleIdsForDateRange(
  /** First publication date, inclusive */
  startDate: LocalDate,
  /** Last publication date, inclusive */
  endDate: LocalDate,
) {
  const puzzles = await fetchNyt<NytArchivePuzzle[]>(
    `/svc/games/v1/archive/crossword_daily/${startDate.toString()}/${endDate.toString()}`,
  )
  return puzzles.map(({ id }) => id)
}
