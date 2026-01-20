type DaySchedule = {
  type: "Holiday" | "Working day";
  openingTime: string;
  closingTime: string;
};

export type WeekSchedule = {
  Sunday: DaySchedule;
  Monday: DaySchedule;
  Tuesday: DaySchedule;
  Wednesday: DaySchedule;
  Thursday: DaySchedule;
  Friday: DaySchedule;
  Saturday: DaySchedule;
};

export const initialSchedule: WeekSchedule = {
  Sunday: {
    type: "Holiday",
    openingTime: "",
    closingTime: "",
  },
  Monday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "8:00 PM",
  },
  Tuesday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "8:00 PM",
  },
  Wednesday: {
    type: "Working day",
    openingTime: "8:00 AM",
    closingTime: "6:00 PM",
  },
  Thursday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "8:00 PM",
  },
  Friday: {
    type: "Working day",
    openingTime: "9:30 AM",
    closingTime: "7:59 PM",
  },
  Saturday: {
    type: "Working day",
    openingTime: "9:00 AM",
    closingTime: "1:00 PM",
  },
};

export const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;