import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function TypeValidator<T>(values: T[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || !values.includes(value)) {
      return { types: { values } };
    } else {
      return null;
    }
  };
}