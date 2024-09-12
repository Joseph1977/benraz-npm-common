import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidators {
  private static readonly atLeastOneCharacterRegex = '.*\\S+.*';

  static requiredIf(condition: boolean): ValidatorFn {
    const validation = (): ValidationErrors | null => {
      return condition ? Validators.required : null;
    };
    return validation;
  }

  static patternIf(condition: boolean, pattern: string | RegExp): ValidatorFn {
    const validation = (): ValidationErrors | null => {
      return condition ? Validators.pattern(pattern) : null;
    };
    return validation;
  }

  static notEmptyOrWhitespace(control: AbstractControl): ValidationErrors {
    return Validators.pattern(CustomValidators.atLeastOneCharacterRegex)(control);
  }

  static greaterThanDatesValidator(startControlName: string, endControlName: string, errorMessage: string): ValidatorFn {
    const validation = (group: FormGroup): ValidationErrors => {
      const startControl = group.controls[startControlName];
      const endControl = group.controls[endControlName];

      if (!startControl.value || !endControl.value) {
        return null;
      }

      if (new Date(endControl.value) <= new Date(startControl.value)) {
        endControl.setErrors({ minValue: errorMessage });
      } else {
        endControl.setErrors(null);
      }

      return;
    };

    return validation;
  }
}
