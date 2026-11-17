import type { EncodedPuzzleStat } from './hydrate.ts'
import type { NytGameStates } from '@/types.ts'

/** Converts NYT game states into puzzle stats, keeping only puzzles that were solved. */
export const parseGameStates = (
  /** Response body from the NYT game state endpoint. */
  { states }: NytGameStates,
): EncodedPuzzleStat[] =>
  states.flatMap(({ puzzle_id, print_date, game_data: { firstSolve, firstSolveDate } }) =>
    firstSolve && firstSolveDate
      ? [
          {
            id: Number(puzzle_id),
            date: print_date,
            // The timestamp is in New York time, so its date part is the local solve date
            dateSolved: firstSolveDate.slice(0, 10),
            time: firstSolve,
          },
        ]
      : [],
  )
