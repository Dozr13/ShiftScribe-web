export interface UserData {
  organization?: string;
  email?: string;
  displayName?: string;
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
  jobNumber: number;
  jobName: string;
}

export type OrgJobs = Record<string, OrgJob>;

export type RecordEventType = 'clockin' | 'clockout' | 'break' | 'endbreak';

export interface EventObject {
  job?: string;
  type?: RecordEventType;
}

/**
 * JS doesn't like numbers as keys to objects. We must conver this on the client.
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
