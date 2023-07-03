import { Events } from '../types/data';

class TimeParser {
  /**
   * Time Structure
   *
   * [org]/members/[uid]/currentRecord
   * events = {
   *   Job: string,
   *   Type: 'clockin' | 'clockout'
   * }
   */

  constructor() {}

  parseCurrentRecord(profile: Events) {
    const events: number[] = [];

    for (const object in profile) {
      events.push(Number(object));
    }

    // Sort the event keys
    events.sort((a, b) => a - b);

    let meta = null;
    let time = 0;
    let breakTime = 0;
    let breakStart;
    let breakEnd;
    let origin = events[0];
    let job = undefined;
    let calledIn = false;

    const lastRecord = profile[events[events.length - 1]];
    let onBreak =
      lastRecord !== undefined ? lastRecord.type === 'break' : false;

    core: for (const key of events) {
      const packet = profile[key];
      //console.log(`\t- ${packet.type} @ ${key / 1000}s`);
      job = packet.job;

      switch (packet.type) {
        case 'calledin':
          calledIn = true;
          meta = packet.meta;
          break core;
        case 'clockin':
          origin = key;
          time = origin - key;
          time -= breakTime;
          break;
        case 'break':
          breakEnd = undefined;
          breakStart = key;
          break;
        case 'endbreak':
          if (breakStart) {
            breakTime += key - breakStart;
          }
          breakEnd = key;
          breakStart = undefined;
          break;
        case 'clockout':
          time += key - origin;
          time -= breakTime;
          break;
      }
    }

    return {
      breakTime: breakTime,
      timeWorked: time,
      job: job,
      origin: origin,
      onBreak: onBreak,
      onBreakFor: onBreak ? Date.now() - events[events.length - 1] : 0,
      calledIn: calledIn,
      meta: meta,
    };
  }
}

const timeParser = new TimeParser();
export default timeParser;
