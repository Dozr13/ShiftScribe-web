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
  jobName: string;
  jobNumber: string;
  jobAddress: string;
}

export type OrgJobs = Record<string, OrgJob>;

export type RecordEventType =
  | 'clockin'
  | 'clockout'
  | 'break'
  | 'endbreak'
  | 'calledin'
  | 'adjustmentRequest'
  | 'location';

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

type UserProfileDataGeneric<T> = {
  [K in keyof UserProfileData]: T extends 'toDate'
    ? UserProfileData[K]
    : UserProfileData[K] extends Date
    ? number
    : UserProfileData[K];
};

export type UserProfileDataTimestamps = DateOrNumber<UserProfileData>;

type RequestData = {
  id: number;
  submitter: string;
  dateRequest: number;
  inRequest: number;
  outRequest: number;
  jobs: EventObject[];
  totalTimeRequested: number;
};

type FullProfileData = UserProfileData & RequestData;

export type EitherProfileData = UserProfileData | RequestData;
