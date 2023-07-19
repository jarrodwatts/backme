export default function formatDate(inputDate: string): string {
  try {
    const date = new Date(inputDate);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - date.getTime();
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = 60 * millisecondsPerSecond;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;
    const millisecondsPerWeek = 7 * millisecondsPerDay;

    if (timeDifference < millisecondsPerHour) {
      // Less than an hour
      return `${Math.floor(timeDifference / millisecondsPerMinute)}m`;
    } else if (timeDifference < millisecondsPerDay) {
      // Less than a day
      return `${Math.floor(timeDifference / millisecondsPerHour)}H`;
    } else if (timeDifference < millisecondsPerWeek) {
      // Less than a week
      return `${Math.floor(timeDifference / millisecondsPerDay)}D`;
    } else {
      // More than or equal to a week
      return `${Math.floor(timeDifference / millisecondsPerWeek)}W`;
    }
  } catch (error) {
    return "";
  }
}
