import { describe, expect, it } from 'vitest'
import { parseGameStates } from './parseGameStates'

describe('parseGameStates', () => {
  it('returns the first solve time and date for solved puzzles', () => {
    const stats = parseGameStates({
      states: [
        {
          puzzle_id: '22677',
          print_date: '2025-04-02',
          game_data: { firstSolve: 601, firstSolveDate: '2025-04-03T07:40:35-04:00', playTimeSeconds: 650 },
        },
      ],
    })

    expect(stats).toEqual([{ id: 22677, date: '2025-04-02', dateSolved: '2025-04-03', time: 601 }])
  })

  it('skips puzzles that were started but never solved', () => {
    const stats = parseGameStates({
      states: [
        { puzzle_id: '22678', print_date: '2025-04-03', game_data: { playTimeSeconds: 120, completionFraction: 0.4 } },
      ],
    })

    expect(stats).toEqual([])
  })
})
