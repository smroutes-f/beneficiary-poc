import { AbstractControl, FormArray, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ValidatePercentageSum(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const beneficiariesArray = control as FormArray;
        const percentages = beneficiariesArray.controls.map(beneficiary =>
          beneficiary.get('details.percentageAssigned') as FormControl
        ).filter(el => !!el);
    
        const sum = percentages.reduce((acc, curr) => acc + (curr.value || 0), 0);
    
        if (sum !== 100) {
          percentages.forEach(control => {
            control.setErrors({ invalidPercentageSum: true });
            control.markAsTouched(); // Mark the control as touched
          });
          
          return { invalidPercentageSum: true };
        }
    
        control.setErrors(null); // Clear the error if the sum is valid
        beneficiariesArray.controls.forEach(beneficiary => {
          beneficiary.get('details.percentageAssigned')?.setErrors(null);
        });
        return null;
    }
}