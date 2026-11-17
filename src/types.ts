import type { LocalDate } from "@js-joda/core"

export type PuzzleStat = {
  /** NYT ID for the puzzle */
  id: number
  /** Publication date of the puzzle */
  date: LocalDate
  /** Date when the puzzle was solved */
  dateSolved: LocalDate
  /** Time in seconds */
  time: number
}

/** A puzzle listed by the NYT games archive endpoint. */
export type NytArchivePuzzle = {
  /** NYT ID for the puzzle */
  id: number
  /** Publication date, as YYYY-MM-DD */
  print_date: string
}

/** Response body from the NYT game state endpoint. Puzzles the user never opened are omitted. */
export type NytGameStates = {
  /** The user's saved state for each requested puzzle they have opened */
  states: NytGameState[]
}

/** The user's saved state for one puzzle. */
export type NytGameState = {
  /** NYT ID for the puzzle, as a string */
  puzzle_id: string
  /** Publication date, as YYYY-MM-DD */
  print_date: string
  /** Progress and timing for the puzzle */
  game_data: {
    /** Share of cells filled, from 0 to 1 */
    completionFraction?: number
    /** Seconds on the clock now, including any time after the first solve */
    playTimeSeconds?: number
    /** Seconds on the clock when the puzzle was first solved */
    firstSolve?: number
    /** When the puzzle was first solved, as an ISO timestamp in New York time */
    firstSolveDate?: string
  }
}
