import { OrgJobs } from '../../types/data';
import { RealtimeCache } from './';

export const JobCache = new RealtimeCache<OrgJobs>(60);
