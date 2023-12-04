interface ISubmit {
  clockedInTime: Date;
  clockedOutTime: Date;
  jobNames: string[] | string;
  selectedDate: Date;
}

class StringUtils {
  addTimeValues(...timeValues: string[]): string {
    let totalMinutes = 0;

    // Convert each time value to minutes and sum them up
    timeValues.forEach((timeValue) => {
      const [hours, minutes] = timeValue.split("h:");
      totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
    });

    // Convert the total minutes back to hh:mm format
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    function padZero(num: number): string {
      return num.toString().padStart(2, "0");
    }

    return `${padZero(totalHours)}h:${padZero(remainingMinutes)}m`;
  }

  /**
   * Convert Unix timestamp to Date object
   * @param {number} timestamp - The Unix timestamp
   * @returns {Date} - The Date object
   */
  convertTimestampToDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000);
  };

  convertTimestampToDateString = (timestampStr: string): string => {
    const timestamp = Number(timestampStr); // Convert string to number
    const date = new Date(timestamp);
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  };

  formatDateForFirebase(date: Date | null): string {
    return date ? date.getTime().toString() : "";
  }

  /**
   * Formats a string to be Firebase-friendly by replacing spaces and special characters.
   * @param {string} inputString - The string to be formatted.
   * @returns {string} - The formatted string.
   */
  formatStringForFirebase(inputString: string): string {
    // Replace spaces with hyphens and remove special characters
    return inputString
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  getHumanReadableDate(date: Date | null) {
    if (!(date instanceof Date)) {
      return;
    }
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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
      const period = hours >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      hours = hours % 12;
      // 12:00 is represented as 0 in 24-hour time, so adjust it
      hours = hours ? hours : 12;

      // Make sure minutes are two digits
      const minutesStr = minutes < 10 ? "0" + minutes : minutes;

      return `${hours}:${minutesStr} ${period}`;
    } catch (error) {
      console.error(`Couldn't convert timestamp to time: ${error}`);
      return "Invalid Timestamp";
    }
  };

  timestampHM(timestamp: number) {
    const seconds = Math.round(timestamp / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    function f(x: number) {
      return String("0" + x).slice(-2);
    }

    return `${h}h:${f(m)}m`;
  }

  timestampToMilliseconds(timeString: string): number {
    const [hours, minutes] = timeString.split(":");
    const hoursInMs = parseInt(hours) * 60 * 60 * 1000;
    const minutesInMs = parseInt(minutes) * 60 * 1000;
    return hoursInMs + minutesInMs;
  }

  /**
   * Converts a string to a URL-friendly format (slugify).
   * @param {string} input - The string to be slugified.
   * @returns {string} - The slugified string.
   */
  slugify(input: string): string {
    return input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
}

const stringUtils = new StringUtils();
export default stringUtils;
