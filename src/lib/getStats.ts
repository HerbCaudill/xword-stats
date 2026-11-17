import { LocalDate } from '@js-joda/core'
import { getStatsForPuzzleIds } from './getStatsForPuzzleIds.ts'
import { getPuzzleIdsForDateRange } from './getPuzzleIdsForDateRange.ts'
import type { EncodedPuzzleStat } from './hydrate.ts'

/** Gets the user's solve stats for puzzles published in a date range. */
export async function getStats({
  startDate,
  endDate = LocalDate.now(),
}: {
  /** First publication date, inclusive */
  startDate: LocalDate
  /** Last publication date, inclusive; defaults to today */
  endDate?: LocalDate
}) {
  if (startDate.isAfter(endDate)) throw new Error('Start date must be before or equal to end date')

  const results: EncodedPuzzleStat[] = []

  // Both NYT endpoints accept at most 31 puzzles per request, so walk the range in 31-day chunks
  for (let chunkStart = startDate; !chunkStart.isAfter(endDate); chunkStart = chunkStart.plusDays(chunkSize)) {
    const chunkEnd = LocalDate.ofEpochDay(Math.min(chunkStart.plusDays(chunkSize - 1).toEpochDay(), endDate.toEpochDay()))
    const puzzleIds = await getPuzzleIdsForDateRange(chunkStart, chunkEnd)
    const stats = await getStatsForPuzzleIds(puzzleIds)
    results.push(...stats)
    console.log(`${chunkStart} to ${chunkEnd}: ${stats.length} of ${puzzleIds.length} puzzles solved`)
  }

  return results
}

const chunkSize = 31
