export class CommonUtils {
  static toBoolean(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    return !!value;
  }
}
