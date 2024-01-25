import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function YearValidator(minYear: number, maxYear: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const year = control.value;

    if (isNaN(year) || year < minYear || year > maxYear) {
      return { invalidYear: true };
    }

    return null;
  };
}
