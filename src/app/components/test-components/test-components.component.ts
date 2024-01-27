import { Component } from '@angular/core';

@Component({
  selector: 'app-test-components',
  standalone: true,
  imports: [],
  templateUrl: './test-components.component.html',
  styleUrl: './test-components.component.scss',
})
export class TestComponentsComponent {
  beneficiariesForm: any = {
    beneficiaries: [],
  };

  errors: any = [];
  validationFnMap: any = [];

  primaryBeneficiarySelectOptions = {
    SPOUSE: 'Spouse',
    NON_SPOUSE: 'Non Spouse',
    TRUST: 'TRUST',
  };

  constructor() {
    this.addBasicFields();
  }

  addBasicFields() {
    this.beneficiariesForm.beneficiaries.push({
      type: '',
    });

    this.validationFnMap.push({
      type: this.validateType,
    });
  }

  get beneficiaries() {
    return this.beneficiariesForm.beneficiaries;
  }

  addNewBeneficiary(): void {
    this.addBasicFields();
    this.updatePercentageAssigned();
  }

  getInitialPaValue(): number {
    const t = this.beneficiaries;
    return 100 / t.length;
  }

  updatePercentageAssigned() {
    this.beneficiariesForm.beneficiaries.forEach((beneficiary: any) => {
      beneficiary.details.percentageAssigned = this.getInitialPaValue();
    });
  }

  removeNewBeneficiary(index: number): void {
    this.beneficiariesForm.beneficiaries.splice(index, 1);
    this.errors.splice(index, 1);
    this.validationFnMap.splice(index, 1);
    this.updatePercentageAssigned();
  }

  updateTypeValue(val: any, i: any): void {
    this.beneficiaries[i].type = val;

    if (this.validateType(val)) {
      this.toggleError(i, 'type', '');
    } else {
      this.toggleError(i, 'type', 'The beneficiary fields is reuqired.');
    }

    if (this.isSNSField(val)) {
      this.beneficiaries[i].details = {
        fullName: '',
        dateOfBirth: {},
        percentageAssigned: this.getInitialPaValue(),
      };

      this.validationFnMap.push({
        fullName: this.validateFullName,
        dateOfBirth: this.validateDateOfBirth,
        percentageAssigned: this.validatePa,
      });
    } else if (this.isTrustField(val)) {
      this.beneficiaries[i].details = {
        trustName: '',
        dateOfEstablished: {},
        percentageAssigned: this.getInitialPaValue(),
      };

      this.validationFnMap.push({
        trustName: this.validateTrustName,
        dateOfEstablished: this.updateEstablished,
        percentageAssigned: this.validatePa,
      });
    }
  }

  validateType(value: string) {
    return ['SPOUSE', 'NONSPOUSE', 'TRUsT', 'ENTITY'].includes(value);
  }

  updateFullName(val: any, i: any) {
    this.beneficiaries[i].details.fullName = val.value;

    if (this.validateFullName(val.value)) {
      this.toggleError(i, 'details.fullName', '');
    } else {
      this.toggleError(
        i,
        'details.fullName',
        'The Full name fields is reuqired.'
      );
    }
  }

  validateFullName(value: any) {
    return value.firstName !== '' && value.lastName !== '';
  }

  updateDob(val: any, i: any) {
    this.beneficiaries[i].details.dateOfBirth = val.value;

    if (this.validateDateOfBirth(val.value)) {
      this.toggleError(i, 'details.dateOfBirth', '');
    } else {
      this.toggleError(
        i,
        'details.dateOfBirth',
        'Please provide a valid date of birth.'
      );
    }
  }

  validateDateOfBirth(value: any): boolean {
    // Add your validation logic here
    const isValidDay =
      value.day !== '' &&
      parseInt(value.day, 10) >= 1 &&
      parseInt(value.day, 10) <= 31;
    const isValidMonth =
      value.month !== '' &&
      parseInt(value.month, 10) >= 1 &&
      parseInt(value.month, 10) <= 12;
    const isValidYear =
      value.year !== '' &&
      parseInt(value.year, 10) >= 1900 &&
      parseInt(value.year, 10) <= new Date().getFullYear();

    return isValidDay && isValidMonth && isValidYear;
  }

  updatePa(val: any, i: any) {
    this.beneficiaries[i].details.pa = val;

    if (this.validatePa(val)) {
      this.toggleError(i, 'details.pa', '');
    } else {
      this.toggleError(
        i,
        'details.pa',
        'Please provide a valid percentage allocation.'
      );
    }
  }

  validatePa(value: number): boolean {
    const finalValue = this.beneficiaries.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );

    if (value < 1 || value > 100 || finalValue !== 100) {
      return false;
    }

    return true;
  }

  updateTrustName(val: any, i: any) {
    this.beneficiaries[i].details.trustName = val;

    if (this.validateTrustName(val)) {
      this.toggleError(i, 'details.trustName', '');
    } else {
      this.toggleError(
        i,
        'details.trustName',
        'Please provide a valid percentage allocation.'
      );
    }
  }

  validateTrustName(value: any) {
    return value !== '';
  }

  updateEstablished(val: any, i: any) {
    this.beneficiaries[i].details.dateOfEstablished = val;

    if (this.validateEstablished(val.value)) {
      this.toggleError(i, 'details.dateOfEstablished', '');
    } else {
      this.toggleError(
        i,
        'details.dateOfEstablished',
        'Please provide a valid date of Established.'
      );
    }
  }

  validateEstablished(value: any): boolean {
    // Add your validation logic here
    const isValidDay =
      value.day !== '' &&
      parseInt(value.day, 10) >= 1 &&
      parseInt(value.day, 10) <= 31;
    const isValidMonth =
      value.month !== '' &&
      parseInt(value.month, 10) >= 1 &&
      parseInt(value.month, 10) <= 12;
    const isValidYear =
      value.year !== '' &&
      parseInt(value.year, 10) >= 1900 &&
      parseInt(value.year, 10) <= new Date().getFullYear();

    return isValidDay && isValidMonth && isValidYear;
  }

  isSNSField(type: string): boolean {
    if (
      type === this.primaryBeneficiarySelectOptions.SPOUSE ||
      type === this.primaryBeneficiarySelectOptions.NON_SPOUSE
    ) {
      return true;
    }

    return false;
  }

  isTrustField(type: string): boolean {
    if (type === this.primaryBeneficiarySelectOptions.TRUST) {
      return true;
    }

    return false;
  }

  getBeneficiariesCount(): number {
    return this.beneficiaries.length;
  }

  toggleError(index: number, path: string, message: string): void {
    // Check if there is an error object for the given index
    const existingError = this.errors[index];
    const errorKey = this.getErrorKey(index, path);

    if (existingError) {
      // If an error object for the index already exists, update the boolean value
      existingError[errorKey] = message;
    } else {
      // If no error object for the index exists, create a new one
      const newError = {
        [errorKey]: message,
      };

      // Push the new error object to the errors array
      this.errors[index] = newError;
    }
  }

  getErrorKey(index: number, path: string) {
    return `beneficiaries[${index}].${path}`;
  }

  checkValidation(index: number, key: string): string | null {
    const errorKey = this.getErrorKey(index, key);

    // Check if there is an error object for the given index
    if (this.errors[index]) {
      // Check if the specified error key is present in the error object
      return this.errors[index][errorKey] || null;
    }

    // No error object found for the given index
    return null;
  }

  validateAllFields() {
    this.beneficiaries.forEach((beneficiary: any, index: number) => {
      if (beneficiary.hasOwnProperty('type')) {
        if (!this.validationFnMap[index].type(beneficiary.type)) {
          this.toggleError(index, 'type', 'Type field is required.');
        } else {
          this.toggleError(index, 'type', '');
        }
      }

      if (beneficiary.hasOwnProperty('details')) {
        for (let [key, value] of Object.entries(beneficiary.details)) {
          if (this.validationFnMap[index] && this.validationFnMap[index][key]) {
            if (this.validationFnMap[index][key](value)) {
              this.toggleError(index, `details.${key}`, '');
            } else {
              this.toggleError(index, `details.${key}`, `Invlaid field value`);
            }
          }
        }
      }
    });
  }

  checkIfErrorExist(): boolean {

    const currentError = this.errors.map((error: string) => error).filter((err: any) => !!err);

    return currentError.length > 0;
  }

  finalSubmit() {
    this.validateAllFields();

    if(this.checkIfErrorExist()) {
      // The form is not valid
    }
    else {
      // The form is ready for the next step
    }
  }
}
