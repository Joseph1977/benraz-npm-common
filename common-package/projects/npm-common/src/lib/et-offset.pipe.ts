import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from './date-utils';

@Pipe({ name: 'etOffset' })
export class ETOffsetPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return null;
    }

    return DateUtils.addETOffset(new Date(value));
  }
}
