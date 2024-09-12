// @dynamic
export class DateUtils {

  static addUTOffset(date: Date): Date {
    return this.addTime(date, this.getUTOffsetToLocal());
  }

  static substructUTOffset(date: Date): Date {
    return this.addTime(date, -this.getUTOffsetToLocal());
  }

  static addETOffset(date: Date): Date {
    return this.addTime(date, this.getETOffsetToLocal());
  }

  static substructETOffset(date: Date): Date {
    return this.addTime(date, -this.getETOffsetToLocal());
  }

  static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);

    return newDate;
  }

  static addTime(date: Date, time: number): Date {
    const newDate = new Date(date);
    newDate.setTime(date.getTime() + time);

    return newDate;
  }

  static getUTOffsetToLocal(): number {
    return this.getOffsetToLocal('UTC')
  }

  static getETOffsetToLocal(): number {
    return this.getOffsetToLocal('America/New_York')
  }

  static getOffsetToLocal(timeZone: string): number {
    const localDate = new Date();
    const timeZoneDate = new Date(localDate.toLocaleString('en-US', { timeZone }));

    const offset = timeZoneDate.getTime() - (localDate.getTime() - localDate.getTime() % 1000);
    return offset;
  }

  static toIsoDateString(date) {
    if (this.isIsoDate(date)) {
      return date;
    }
    date = new Date(date);
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    
    const dateString = date.toISOString() as string;
    return dateString.substring(0, 10);
  }

  private static isIsoDate(date) {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(date);
  }
}
