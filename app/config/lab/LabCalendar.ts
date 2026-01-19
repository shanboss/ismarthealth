
export type CalendarEvent = {
  date: number;
  type: "holiday" | "working";
  label?: string;
  startTime?: string;
  dayName?: string;
};

export const sampleEvents: CalendarEvent[] = [
  { date: 10, type: "working", dayName: "thursday", startTime: "9:30", label: "9:30a Day: thursday Start time : 9:" },
  { date: 11, type: "working", dayName: "thursday", startTime: "9:30", label: "9:30a Day: thursday Start time : 9:" },
  { date: 12, type: "working", dayName: "friday", startTime: "9:30", label: "9:30a Day: friday Start time : 9:30" },
  { date: 13, type: "working", dayName: "saturday", startTime: "9:00", label: "9a Day: saturday Start time : 9:00" },
  { date: 14, type: "holiday", label: "HOLIDAY" },
  { date: 15, type: "working", dayName: "monday", startTime: "9:30", label: "9:30a Day: monday Start time : 9:" },
  { date: 16, type: "working", dayName: "tuesday", startTime: "9:30", label: "9:30a Day: tuesday Start time : 9:3" },
  { date: 17, type: "working", dayName: "wednesday", startTime: "8:00", label: "8a Day: wednesday Start time : 8:" },
  { date: 18, type: "working", dayName: "thursday", startTime: "9:30", label: "9:30a Day: thursday Start time : 9:" },
  { date: 19, type: "working", dayName: "friday", startTime: "9:30", label: "9:30a Day: friday Start time : 9:30" },
  { date: 20, type: "working", dayName: "saturday", startTime: "9:00", label: "9a Day: saturday Start time : 9:00" },
];

export const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];