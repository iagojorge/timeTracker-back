class DateUtils {
  static formatDate(data: Date, locale: string) {
    if (!(data instanceof Date)) {
      return "Invalid date";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return data.toLocaleDateString(locale, options);
  }

  static convertTimestampToTimeString(time: number) {
    return new Date(time * 1000).toISOString().slice(11, 19);
  }

  static getFormattedAndCurrentDate() {
    const formattedDate = DateUtils.formatDate(new Date(), "pt-BR");
    const todayDate = new Date();
    return { formattedDate, todayDate };
  }
}
