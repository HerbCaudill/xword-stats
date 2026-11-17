"use client"

import { dayNames } from "@/constants"
import cx from "classnames"
import { getColor } from "./getColor"

export function DayLegend({ selectedDay, onDaySelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1 p-2">
      <div
        className={cx(
          `flex cursor-pointer items-center gap-1 rounded border p-1 hover:bg-gray-100`,
          {
            "border-white": selectedDay !== null,
            "border-gray-300": selectedDay === null,
          },
        )}
        onClick={() => onDaySelect(null)}
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: selectedDay === null ? "#666666" : "#cccccc",
          }}
        />
        <span className="text-xs">All</span>
      </div>
      {Object.entries(dayNames).map(([dayNum, dayName]) => (
        <div
          key={dayNum}
          className={cx(
            `flex cursor-pointer items-center gap-1 rounded border p-1 hover:bg-gray-100`,
            {
              "border-white": selectedDay !== Number(dayNum),
              "border-gray-300": selectedDay === Number(dayNum),
            },
          )}
          onClick={() => {
            if (selectedDay === Number(dayNum)) onDaySelect(null)
            else onDaySelect(Number(dayNum))
          }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor:
                selectedDay === null || selectedDay === Number(dayNum)
                  ? getColor(dayNum)
                  : "#cccccc",
            }}
          />
          <span className="text-xs">{dayName}</span>
        </div>
      ))}
    </div>
  )
}

type Props = {
  selectedDay: number | null
  onDaySelect: (day: number | null) => void
}
