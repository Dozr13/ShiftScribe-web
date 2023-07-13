class StringUtils {
  /**
   * Return a localized time based on the milliseconds value given.
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

  timestampToMilliseconds(timeString: string): number {
    const [hours, minutes] = timeString.split(':');
    const hoursInMs = parseInt(hours) * 60 * 60 * 1000;
    const minutesInMs = parseInt(minutes) * 60 * 1000;
    return hoursInMs + minutesInMs;
  }

  timestampHM(ms: number) {
    const seconds = Math.round(ms / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    function f(x: number) {
      return String('0' + x).slice(-2);
    }

    return `${h}h:${f(m)}m`;
  }

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

  sumCallIns(callIns: boolean[]): number {
    const total = callIns.reduce((sum, value) => sum + (value ? 1 : 0), 0);
    return total;
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
}

const stringUtils = new StringUtils();
export default stringUtils;
