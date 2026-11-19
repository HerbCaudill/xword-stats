"use client"

import { DayLegend, PuzzleChart } from "@/components"
import { useDayNavigation } from "@/hooks/useDayNavigation"
import { usePuzzleStats } from "@/hooks/useStats"
import { dayFromQuery } from "@/lib/dayFromQuery"
import { useDrag } from "@use-gesture/react"
import { useEffect, useState } from "react"

export default function HistoryPage() {
  const { stats } = usePuzzleStats()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  // Another app can open the chart on a day, such as the games app's crossword for that day
  useEffect(() => {
    const day = dayFromQuery(window.location.search)
    if (day) setSelectedDay(day)
  }, [])
  const { navigateToNextDay, navigateToPreviousDay } = useDayNavigation(selectedDay, setSelectedDay)

  const bind = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX === -1) {
        // Swipe left - go to next day
        navigateToNextDay()
      } else if (swipeX === 1) {
        // Swipe right - go to previous day
        navigateToPreviousDay()
      }
    },
    {
      swipe: {
        distance: 50, // Minimum distance for swipe detection
        velocity: 0.5, // Minimum velocity for swipe detection
      },
    },
  )

  return (
    <div {...bind()} className="fixed inset-0 flex w-full max-w-xl touch-pan-y flex-col">
      <DayLegend selectedDay={selectedDay} onDaySelect={setSelectedDay} />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-none pt-2">
        <PuzzleChart stats={stats} selectedDay={selectedDay} />
      </main>
    </div>
  )
}
