import { EventObject } from "../types/data";
import stringUtils from "./StringUtils";

export const calculateTotalTime = (events: Record<string, EventObject>) => {
  const timeIn = Object.keys(events).find(
    (key) => events[key].type === "clockin",
  );
  const timeOut = Object.keys(events).find(
    (key) => events[key].type === "clockout",
  );

  if (timeIn && timeOut) {
    const totalTime = parseInt(timeOut) - parseInt(timeIn);
    return stringUtils.timestampHM(totalTime);
  }

  return "Clock in or out time is missing from this request";
};

export const extractDate = (timestamp: string) => {
  const dateTimestamp = parseInt(timestamp);
  if (!isNaN(dateTimestamp)) {
    return stringUtils.convertTimestampToDateString(dateTimestamp.toString());
  }
  return "Invalid Date";
};

export const extractJobs = (events: Record<string, EventObject>) => {
  let lastJob: string | null = null;
  const uniqueJobs: string[] = [];

  Object.values(events).forEach((event) => {
    if (event.job && event.job !== lastJob) {
      uniqueJobs.push(event.job);
      lastJob = event.job;
    }
  });

  return uniqueJobs.join(", ") || "No Jobs";
};

export const extractTime = (
  events: Record<string, EventObject>,
  eventType: string,
) => {
  const timestamp = Object.keys(events).find(
    (key) => events[key].type === eventType,
  );

  return timestamp ? stringUtils.timestampToHHMM(parseInt(timestamp)) : "N/A";
};
