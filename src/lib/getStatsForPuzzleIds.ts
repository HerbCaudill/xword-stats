import type { NytGameStates } from "@/types.ts"
import { fetchNyt } from "./fetchNyt.ts"
import { parseGameStates } from "./parseGameStates.ts"

/** Gets the user's solve stats for up to 31 puzzle IDs. */
export async function getStatsForPuzzleIds(
  /** NYT puzzle IDs */
  puzzleIds: number[],
) {
  if (puzzleIds.length === 0) return []
  const states = await fetchNyt<NytGameStates>(
    `/svc/games/state/crossword_daily/latests?puzzle_ids=${puzzleIds.join(",")}`,
  )
  return parseGameStates(states)
}
