import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidatePercentageSum } from '@app/utils/PercentageSumValidator';
import { TypeValidator } from '@app/utils/TypeValidator';
import { BeneficiaryTypes } from '@app/utils/constants';
import { CapitalizePipe } from '@app/utils/capitalize.pipe';

import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';
import { GreaterThanZeroValidator } from '@app/utils/GreaterThanZeroValidator';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CapitalizePipe,
    NgbDatepickerModule,
    ReactiveFormsModule,
    BeneficiaryComponent,
  ],
  templateUrl: './add-beneficiary.component.html',
  styleUrl: './add-beneficiary.component.scss',
})
export class AddBeneficiaryComponent {
  beneficiariesForm: FormGroup;
  allBeneficiaryTypes: string[];

  constructor(private fb: FormBuilder) {
    this.beneficiariesForm = this.fb.group({
      beneficiaries: this.fb.array([this.getPrimaryBeneficiaryFields()], {
        validators: [ValidatePercentageSum()],
      }),
    });

    this.allBeneficiaryTypes = Array.from(Object.values(BeneficiaryTypes));
  }

  get beneficiaries(): FormArray {
    return this.beneficiariesForm.get('beneficiaries') as FormArray;
  }

  getPrimaryBeneficiaryFields() {
    return this.fb.group({
      type: [null, TypeValidator(Object.keys(BeneficiaryTypes))],
    });
  }

  getArrayElements(): FormGroup[] {
    return this.beneficiaries.controls.map((control) => control as FormGroup);
  }

  addNewBeneficiary() {
    this.beneficiaries.push(this.getPrimaryBeneficiaryFields());
    this.updatePaValue();
  }

  removeNewBeneficiary(index: number) {
    this.beneficiaries.removeAt(index);
    this.updatePaValue();
  }

  updatePaValue() {
    const pa = 100 / this.beneficiaries.length;
    this.beneficiaries.controls.forEach((control) => {
      const t = control.get('details.percentageAssigned') as FormControl;
      if (t) t.setValue(pa);
    });
  }

  onSubmit() {
    console.log('Called');
    this.beneficiariesForm.markAllAsTouched();

    console.log(this.beneficiariesForm.value);
    if (this.beneficiariesForm.valid) {
      // this.showReviewPage = true;
    }
  }

  onSelectChange(event: Event, index: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    if (selectedValue === BeneficiaryTypes.TRUST) {
      this.setTrustBeneficiaryFormFields(index);
    } else if (
      selectedValue === BeneficiaryTypes.NON_SPOUSE ||
      selectedValue === BeneficiaryTypes.SPOUSE
    ) {
      this.setHumanBeneficiaryFormFields(index);
    }
  }

  isInValidField(field: string, index: number): boolean {
    const result =
      this.beneficiaries.at(index).get(field)?.invalid &&
      this.beneficiaries.at(index).get(field)?.touched;
    return !!result;
  }

  isValidField(field: string, index: number): boolean {
    const result =
      this.beneficiaries.at(index).get(field)?.valid &&
      this.beneficiaries.at(index).get(field)?.touched;
    return !!result;
  }

  setHumanBeneficiaryFormFields(index: number): void {
    const fields = this.beneficiaries.at(index) as FormGroup;
    if (!fields) return;

    fields.removeControl('details');
    fields.addControl(
      'details',
      this.fb.group({
        firstName: ['', Validators.required],
        middleName: [],
        lastName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        percentageAssigned: [
          this.getInitialPaValue(),
          [Validators.required, GreaterThanZeroValidator()],
        ],
      })
    );
  }

  setTrustBeneficiaryFormFields(index: number): void {
    const fields = this.beneficiaries.at(index) as FormGroup;
    if (!fields) return;

    fields.removeControl('details');
    fields.addControl(
      'details',
      this.fb.group({
        trustName: ['', Validators.required],
        established: ['', Validators.required],
        percentageAssigned: [
          this.getInitialPaValue(),
          [Validators.required, , GreaterThanZeroValidator()],
        ],
      })
    );
  }

  getInitialPaValue(): number {
    const t = this.beneficiaries as FormArray;
    return 100 / t.length;
  }

  getErrorMessages(controlName: string, index: number): string {
    const control = this.beneficiaries.at(index).get(controlName);

    if (control?.hasError('required')) {
      return 'Please add the percentage assigned.';
    }

    if (control?.hasError('invalidPercentageSum')) {
      return 'Total percentage assigned must equal 100%.';
    }

    if (control?.hasError('greaterThanZero')) {
      return 'Please add a value greater than 0.';
    }

    return '';
  }

  getBeneficiariesCount() {
    return this.beneficiaries.length;
  }

  isFieldAvailable(controlName: string, index: number): boolean {
    return this.beneficiaries.at(index).get(controlName) !== null;
  }

  checkType(index: number, expectedType: string): boolean {
    const actualType = this.beneficiaries.at(index).get('type')?.value;

    if (actualType !== null && actualType !== undefined) {
      const expectedTypesArray = expectedType
        .split(',')
        .map((type) => type.trim());
      return expectedTypesArray.includes(actualType);
    }

    return false;
  }
}
