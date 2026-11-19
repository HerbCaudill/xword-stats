import { describe, expect, it } from "vitest"
import { dayFromQuery } from "./dayFromQuery"

describe("dayFromQuery", () => {
  it("reads a day of the week from 1 (Monday) to 7 (Sunday)", () => {
    expect(dayFromQuery("?day=1")).toBe(1)
    expect(dayFromQuery("?day=7")).toBe(7)
  })

  it("ignores a missing or invalid day", () => {
    expect(dayFromQuery("")).toBeNull()
    expect(dayFromQuery("?day=0")).toBeNull()
    expect(dayFromQuery("?day=8")).toBeNull()
    expect(dayFromQuery("?day=fri")).toBeNull()
  })
})
