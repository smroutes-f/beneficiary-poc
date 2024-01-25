import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function DayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const day = control.value;

    if (isNaN(day) || day < 1 || day > 31) {
      return { invalidDay: true };
    }

    return null;
  };
}
