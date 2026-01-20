"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CalendarEvent, sampleEvents, monthNames, daysOfWeek } from "../../config/lab/LabCalendar";



export default function LabCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("month");

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    return { startingDayOfWeek, daysInMonth };
  };

  const { startingDayOfWeek, daysInMonth } = getMonthData(currentDate);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventForDate = (day: number): CalendarEvent | undefined => {
    return sampleEvents.find(event => event.date === day);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="min-h-[120px] border border-foreground/10 bg-foreground/5 p-2">
          <div className="text-lg text-foreground/40">{prevMonthLastDay - i}</div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDate(day);
      const hasEvent = event !== undefined;
      const isHighlighted = day === 10; // December 10 has yellow background in the image

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-foreground/10 p-2 ${
            isHighlighted ? "bg-yellow-100" : "bg-background"
          }`}
        >
          <div className={`text-lg ${hasEvent ? "text-blue-500" : "text-foreground"}`}>
            {day}
          </div>
          {hasEvent && (
            <div className="mt-2">
              {event.type === "holiday" ? (
                <div className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                  {event.label}
                </div>
              ) : (
                <div className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                  {event.label}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Next month's leading days
    const totalCells = days.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="min-h-[120px] border border-foreground/10 bg-foreground/5 p-2">
          <div className="text-lg text-foreground/40">{day}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          <span className="font-bold">iNet Lab</span>{" "}
          <span className="font-normal">Calendar</span>
        </h1>
      </div>

      <div className="h-1 bg-blue-500"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="flex h-10 w-10 items-center justify-center rounded border border-foreground/20 bg-background text-foreground hover:bg-foreground/5"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded border border-foreground/20 bg-background text-foreground hover:bg-foreground/5"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="rounded border border-foreground/20 bg-background px-4 py-2 text-sm text-foreground hover:bg-foreground/5"
          >
            today
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-normal text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded border border-foreground/20 bg-background">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`px-3 py-2 text-sm ${
                viewMode === "month"
                  ? "bg-foreground/10 font-medium text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              month
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`px-3 py-2 text-sm ${
                viewMode === "week"
                  ? "bg-foreground/10 font-medium text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              week
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`px-3 py-2 text-sm ${
                viewMode === "day"
                  ? "bg-foreground/10 font-medium text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              day
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-foreground/10 font-medium text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              list
            </button>
          </div>
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            Ad hoc purpose
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-foreground/20 bg-foreground/5">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="border-r border-foreground/10 px-4 py-3 text-center font-semibold text-foreground last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  );
}
