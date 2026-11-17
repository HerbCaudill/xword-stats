import _persistedStats from '../data/persistedStats.json'
import { PuzzleStat } from '../types'
import { describe, expect, it } from 'vitest'
import { analyzeStats } from './analyzeStats'
import { hydrate } from './hydrate'

const stats = hydrate(_persistedStats)

describe('analyzeStats', () => {
  it('should analyze puzzle statistics correctly', () => {
    const result = analyzeStats(stats as PuzzleStat[])

    expect(result.average).toMatchInlineSnapshot(`1113`)
    expect(result.best).toMatchInlineSnapshot(`
      {
        "date": "2021-08-02",
        "dateSolved": "2021-08-03",
        "id": 19428,
        "time": 259,
      }
    `)
    expect(result.total).toMatchInlineSnapshot(`2304937`)
    expect(result.stats.length).toMatchInlineSnapshot(`2071`)

    expect(result.minDate.toString()).toMatchInlineSnapshot(`"2017-01-01"`)
    expect(result.maxDate.toString()).toMatchInlineSnapshot(`"2026-12-31"`)

    expect(result.years).toMatchInlineSnapshot(`
      [
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
      ]
    `)

    const monday = result.byDayOfWeek['1']
    expect(monday.average).toMatchInlineSnapshot(`455`)
    expect(monday.best?.time).toMatchInlineSnapshot(`259`)
    expect(monday.total).toMatchInlineSnapshot(`122967`)
    expect(monday.stats.length).toMatchInlineSnapshot(`270`)
  })
})
