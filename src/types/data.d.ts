export interface UserData {
  organization: string;
  email: string;
  displayName: string;
}

export interface OrgData {
  members?: {
    [key: number]: OrgProfile;
  };
  joinRequests?: {
    [key: number]: true;
  };
  superuser?: string;
  timeRecords?: TimeRecords;
}

export interface OrgJob {
  id: string;
  jobName: string;
  jobNumber: string;
  jobAddress: string;
}

export type OrgJobs = Record<string, OrgJob>;

export type RecordEventType =
  | "clockin"
  | "clockout"
  | "break"
  | "endbreak"
  | "calledin"
  | "adjustmentRequest"
  | "location";

export interface EventObject {
  job: string;
  type?: RecordEventType;
  meta?: string;
}

/**
 * JS doesn't like numbers as keys to objects. We must convert this on the client.
 */
type Events = Record<string, EventObject>;

export interface OrgProfile {
  accessLevel?: number;
  events?: Events;
}

type EmployeesGridRowData = {
  displayName: string;
  email: string;
  organization: string;
  accessLevel: number;
};

type JobsGridRowData = {
  jobName: string;
  jobNumber: string;
  jobAddress: string;
};

type RequestsGridRowData = {
  id: string;
  submitter: string;
  dateRequest: string;
  inRequest: string;
  outRequest: string;
  jobs: string;
  totalTimeRequested: string;
};

// TODO: implement this as Employee userData
export interface User {
  displayName: string;
  email: string;
  organization: string;
}

export interface Employee {
  id: string;
  accessLevel: number;
  userData: {
    displayName: string;
    email: string;
    organization: string;
  };
}

interface TimeRecord {
  events?: Events;
  submitter?: string;
}

export type TimeRecords = Record<number, TimeRecord>;

type CSVRowData = {
  displayName: string;
  email: string;
  job: string;
  timestamp: Date;
  outTimestamp: Date;
  localeWorkTime: string;
  localeBreakTime: string;
  localeTotalTime: string;
  calledIn: boolean;
  reasonMissed?: string;
};

export type UserProfileData = {
  id: number;
  userId: string;
  date: Date;
  timeWorkedInDay: number;
  clockedIn: Date;
  clockedOut: Date;
  breaks: number;
  job: string;
  submitter?: string;
  dateRequest?: string;
  inRequest?: string;
  outRequest?: string;
  jobs?: EventObject[];
  totalTimeRequested?: string;
};

export interface UserDataTotals {
  id: string;
  employeeName: string;
  employeeEmail: string;
  totalWorkTime: string;
  totalBreakTime: string;
  totalPaidTime: string;
  totalCallIns: number;
}

type UserProfileDataGeneric<T> = {
  [K in keyof UserProfileData]: T extends "toDate"
    ? UserProfileData[K]
    : UserProfileData[K] extends Date
    ? number
    : UserProfileData[K];
};

export type UserProfileDataTimestamps = DateOrNumber<UserProfileData>;

type OrgRequests = {
  id: string;
  submitter: string;
  dateRequest: number; // Timestamp of when the request was made
  inRequest: number; // Timestamp for the time-in event
  outRequest: number; // Timestamp for the time-out event
  jobs: EventObject[]; // Array of job events
  totalTimeRequested: number; // Total time requested in the events
  events: Record<string, EventObject>; // Map of timestamp strings to EventObjects
};

type FullProfileData = UserProfileData & OrgRequests;

export type EitherProfileData = UserProfileData | OrgRequests;
