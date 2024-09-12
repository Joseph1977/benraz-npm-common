import { MatDateFormats } from '@angular/material/core';

export const DEFAULT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/DD/yyyy'
  },
  display: {
    dateInput: 'MM/DD/yyyy',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
