import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatePercentageSum } from '@app/utils/PercentageSumValidator';
import { TypeValidator } from '@app/utils/TypeValidator';
import { BeneficiaryTypes } from '@app/utils/constants';

import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BeneficiaryComponent
  ],
  templateUrl: './add-beneficiary.component.html',
  styleUrl: './add-beneficiary.component.scss'
})
export class AddBeneficiaryComponent {

  beneficiariesForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.beneficiariesForm = this.fb.group({
      beneficiaries: this.fb.array(
        [ this.getPrimaryBeneficiaryFields()],
        { validators: [ValidatePercentageSum()] }),
    });
  }

  get beneficiaries(): FormArray {
    return this.beneficiariesForm.get('beneficiaries') as FormArray;
  }

  getPrimaryBeneficiaryFields() {
    return  this.fb.group({
      type: [null, TypeValidator(Object.keys(BeneficiaryTypes))],
    });
  }

  getArrayElements(): FormGroup[] {
    return this.beneficiaries.controls.map(control => control as FormGroup);
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
    this.beneficiaries.controls.forEach(control => {
      const t = control.get('details.percentageAssigned') as FormControl;
      if(t) t.setValue(pa);
    });
  }

  onSubmit() {
    console.log("Called");
    this.beneficiariesForm.markAllAsTouched();

    console.log(this.beneficiariesForm.value);
    if(this.beneficiariesForm.valid) {
      // this.showReviewPage = true;
    }
  }
}
