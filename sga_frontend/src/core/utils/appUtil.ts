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
}
