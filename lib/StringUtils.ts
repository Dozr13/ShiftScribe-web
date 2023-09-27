import { Events } from '../types/data';

interface ISubmit {
  clockedInTime: Date;
  clockedOutTime: Date;
  jobNames: string[] | string;
  selectedDate: Date;
}

class StringUtils {
  /**
   * Return a localized time based on the miliseconds value given.
   *
   * If passing seconds, multiply by 1000.
   *
   * ```ts
   * timestampToLocale(3600000) // "1 Hour"
   * timestampToLocale(8600000) // "2 Hours"
   * ```
   *
   * @param ms time in milliseconds
   * @returns string
   */
  timestampToLocale(ms: number) {
    const seconds = ms / 1000;
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    function plural(v: number) {
      return v > 1 ? 's' : '';
    }

    if (d > 0) {
      return `${d} Day${plural(h)}`;
    } else if (h > 0) {
      return `${h} Hour${plural(h)}`;
    } else if (m > 0) {
      return `${m} Minute${plural(m)}`;
    } else return `${s} Second${plural(s)}`;
  }

  /**
   * Converts a Date object to a timestamp.
   * @param date - The Date object to convert
   * @returns The timestamp as a number
   */
  dateToTimestamp = (date?: Date): number | null => {
    if (!date) {
      console.warn('Date object is null or undefined');
      return null;
    }
    return date.getTime();
  };

  /**
   * Converts a timestamp to a string in MM/DD/YYYY format.
   *
   * @param {number} ms - The timestamp in milliseconds.
   * @return {string} - The formatted date string or "Invalid Date" if the timestamp is invalid.
   */
  // Converts a timestamp to MM/DD/YYYY format
  timestampToMMDDYYYY = (ms: number): string => {
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  timestampHM(timestamp: number) {
    const seconds = Math.round(timestamp / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    function f(x: number) {
      return String('0' + x).slice(-2);
    }

    return `${h}h:${f(m)}m`;
  }

  dateToMMDDYYYY = (date: Date): string => {
    if (!date) return '';

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${String('0' + month).slice(-2)}/${String('0' + day).slice(
      -2,
    )}/${year}`;
  };

  dateToHHMM = (date: Date): string => {
    if (!date) return '';
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${String('0' + minutes).slice(-2)} ${period}`;
  };

  /**
   * Returns the local greeting (morning, afternoon or evening).
   * @returns string
   */
  localGreeting() {
    const d = new Date();
    const hours = d.getHours();

    if (hours > 18) {
      return `Evening`;
    } else if (hours > 11) {
      return `Afternoon`;
    } else {
      return `Morning`;
    }
  }

  /**
   * Get the physical storage size of a given string or object.
   *
   * Returns the UTF16 & UTF8 sizes.
   *
   * **NOTE: Firebase Realtime seems to store data in UTF8**
   * @param string
   * @returns number in bytes
   */
  byteSize(input: string | object) {
    if (typeof input === 'object') {
      input = JSON.stringify(input);
    }

    return {
      utf16: input.length * 2,
      utf8: new Blob([input]).size,
    };
  }

  /**
   * Converts a string representation of hours and minutes (e.g., "1h:23m")
   * into its equivalent total minutes.
   *
   * ```ts
   * timeStringToMinutes("1h:23m") // 83
   * timeStringToMinutes("0h:45m") // 45
   * ```
   *
   * @param str string in "h:m" format
   * @returns total minutes as number
   */
  timeStringToMinutes(str: string): number {
    if (!/^(\d+)h:(\d+)m$/.test(str)) {
      console.log(`Invalid input received: ${str}`);
      throw new Error('Invalid format for input string');
    }

    const parts = str.split('h:');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1].slice(0, -1), 10);

    return hours * 60 + minutes;
  }

  /**
   * Convert Unix timestamp in milliseconds to human-readable time in hh:mm am/pm format
   * @param {number} timestamp - The Unix timestamp in milliseconds
   * @returns {string} - The formatted time string
   */
  timestampToHHMM = (timestamp: number): string => {
    try {
      const date = new Date(timestamp); // Create a new Date object using the timestamp
      let hours = date.getHours(); // Extract the hours (0 - 23)
      let minutes = date.getMinutes(); // Extract the minutes (0 - 59)

      // Determine whether it's AM or PM
      const period = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      // 12:00 is represented as 0 in 24-hour time, so adjust it
      hours = hours ? hours : 12;

      // Make sure minutes are two digits
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;

      return `${hours}:${minutesStr} ${period}`;
    } catch (error) {
      console.error(`Couldn't convert timestamp to time: ${error}`);
      return 'Invalid Timestamp';
    }
  };

  getMS(timeString: string): number {
    const [time, modifier] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    const date = new Date();

    let hour = parseInt(hours);
    if (modifier.toLowerCase() === 'pm' && hour < 12) {
      hour += 12;
    } else if (modifier.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }

    const timeInMilliseconds = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hour,
      parseInt(minutes),
    ).getTime();

    return timeInMilliseconds;
  }

  addTimeValues(...timeValues: string[]): string {
    let totalMinutes = 0;

    // Convert each time value to minutes and sum them up
    timeValues.forEach((timeValue) => {
      const [hours, minutes] = timeValue.split('h:');
      totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
    });

    // Convert the total minutes back to hh:mm format
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    function padZero(num: number): string {
      return num.toString().padStart(2, '0');
    }

    return `${padZero(totalHours)}h:${padZero(remainingMinutes)}m`;
  }

  subtractTimeValues(...timeValues: string[]): string {
    let totalMinutes = 0;

    // Convert each time value to minutes and sum them up
    timeValues.forEach((timeValue) => {
      const [hours, minutes] = timeValue.split('h:');
      totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
    });

    // Convert the total minutes back to hh:mm format
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.abs(totalMinutes) % 60;

    function padZero(num: number): string {
      return num.toString().padStart(2, '0');
    }

    const sign = totalMinutes < 0 ? '-' : '';
    return `${sign}${padZero(Math.abs(totalHours))}h:${padZero(
      remainingMinutes,
    )}m`;
  }

  getHumanReadableDate(date: Date | null) {
    if (!(date instanceof Date)) {
      return;
    }
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  formatDateForFirebase(date: Date | null): string {
    return date ? date.getTime().toString() : '';
  }
  timestampToMilliseconds(timeString: string): number {
    const [hours, minutes] = timeString.split(':');
    const hoursInMs = parseInt(hours) * 60 * 60 * 1000;
    const minutesInMs = parseInt(minutes) * 60 * 1000;
    return hoursInMs + minutesInMs;
  }

  /**
   * Convert Unix timestamp to Date object
   * @param {number} timestamp - The Unix timestamp
   * @returns {Date} - The Date object
   */
  convertTimestampToDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000);
  };

  // ! HELPER FUNCTIONS
  logTimestampToHHMM(timestamp: number, stringPassed: string): string {
    const dateObj = new Date(timestamp);

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const hoursString = String(hours).padStart(2, '0');

    const timeString = `${hoursString}:${minutes} ${amOrPm}`;

    console.group();
    console.log('{{{{{{{{{{{{{{{{{');
    console.log('StringUtils.logTimestampToHHMM in: ', stringPassed);
    console.log('dateObj:', dateObj);
    console.log('hours:', hours);
    console.log('minutes:', minutes);
    console.log('hoursString:', hoursString);
    console.log('timeString:', timeString);
    console.log('}}}}}}}}}}}}}}}}}');
    console.groupEnd();

    return timeString;
  }

  logDateToHHMM(time: Date): string {
    const actualTime = time instanceof Date ? time : new Date(time);
    let hours = actualTime.getHours();
    const minutes = String(actualTime.getMinutes()).padStart(2, '0');

    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    const humanReadableTime = `${hours}:${minutes}`;
    console.group('StringUtils.logDateToHHMM: ');
    console.log(
      'actualTime:',
      actualTime,
      'hours:',
      hours,
      'minutes:',
      minutes,
      'amOrPm:',
      amOrPm,
    );
    console.log();
    console.log('{{{{{ humanReadableTime }}}}}:', humanReadableTime, amOrPm);
    console.log();
    console.groupEnd();

    return humanReadableTime;
  }

  /**
   * Logs event objects for easier debugging.
   * Because let's face it, console.logs are the bread and butter of debugging.
   *
   * @param firstString - The string you see first, probably some dramatic headline
   * @param dataObject - The data, can be of type Events or ISubmit
   * @param inTime - Clock-in time as a Date
   * @param outTime - Clock-out time as a Date
   * @param jobs - Array of job names
   * @param lastString - The string you see last, probably some sign-off message
   */
  logEventObjectsData(
    firstString: string,
    eventObject: Events,
    inTime: Date,
    outTime: Date,
    jobs: string[],
    lastString: string,
  ) {
    console.group(firstString);
    console.log(
      'Clocked In Time: ',
      this.dateToHHMM(inTime),
      'Clocked Out Time:',
      this.dateToHHMM(outTime),
      'Jobs:',
      jobs,
    );
    console.log();
    console.log('Event Object: ', eventObject);

    console.log(lastString);
    console.groupEnd();
  }

  logDateToMMDDYYYY(date: Date) {
    const actualDate = date instanceof Date ? date : new Date(date);
    console.log(
      `${
        actualDate.getMonth() + 1
      }/${actualDate.getDate()}/${actualDate.getFullYear()}`,
    );
  }
  // ! HELPER FUNCTIONS
}

const stringUtils = new StringUtils();
export default stringUtils;
