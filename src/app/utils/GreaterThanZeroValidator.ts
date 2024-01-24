import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function GreaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value !== null && value !== undefined && value > 0 ? null : { greaterThanZero: true };
  };
}
