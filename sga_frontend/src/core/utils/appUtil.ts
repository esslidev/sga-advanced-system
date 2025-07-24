export class AppUtil {
  static formatDateToArabic(date: Date): string {
    if (!(date instanceof Date)) {
      console.error("formatDateToArabic expected a Date but got:", date);
      return "";
    }
    return date.toLocaleDateString("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      numberingSystem: "latn",
    });
  }
  static formatDateTimeToArabic(date: Date): string {
    if (!(date instanceof Date)) {
      console.error("formatDateTimeToArabic expected a Date but got:", date);
      return "";
    }
    return date.toLocaleString("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      numberingSystem: "latn",
      hour12: false, // Use 24-hour format; remove if you want 12-hour
    });
  }
}
