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

  static notEmptyOrWhitespace(control: AbstractControl): ValidationErrors | null {
    return Validators.pattern(CustomValidators.atLeastOneCharacterRegex)(control);
  }
  static greaterThanDatesValidator(startControlName: string, endControlName: string, errorMessage: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }
      const group = control as FormGroup;
      const startControl = group.get(startControlName);
      const endControl = group.get(endControlName);

      if (!startControl?.value || !endControl?.value) {
        return null;
      }

      if (new Date(endControl.value) <= new Date(startControl.value)) {
        return { minValue: errorMessage };
      }

      return null;
    };
  }
}
