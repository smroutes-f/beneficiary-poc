import {
  Component,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

import { TypeValidator } from '@app/utils/TypeValidator';
import { CapitalizePipe } from '@app/utils/capitalize.pipe';
import {
  BeneficiaryTypes
} from '@app/utils/constants';
import { BeneficiaryComponent } from '@app/components/beneficiary/beneficiary.component';
import { DateInfo, formatCustomDate } from '@app/utils/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BeneficiaryComponent,
    CapitalizePipe
  ],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  
  @ViewChild('otherFormFields', { read: ViewContainerRef }) myContainerRef: ViewContainerRef | undefined;

  closeResult = '';
  beneficiariesForm: FormGroup;
  otherFields: Array<any> = [];
  showReviewPage: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {

    this.beneficiariesForm = this.fb.group({
      beneficiaries: this.fb.array(
        [ this.getPrimaryBeneficiaryFields()],
        { validators: [ this.validatePercentageSum] }),
    });
  }

  getPrimaryBeneficiaryFields() {
    return  this.fb.group({
      type: [null, TypeValidator(Object.keys(BeneficiaryTypes))],
    });
  }

  onSubmit() {
    this.beneficiariesForm.markAllAsTouched();

    console.log(this.getReviewData());
    if(this.beneficiariesForm.valid) {
      this.showReviewPage = true;
    }
  }

  get beneficiaries(): FormArray {
    return this.beneficiariesForm.get('beneficiaries') as FormArray;
  }

  getArrayElements(): FormGroup[] {
    return this.beneficiaries.controls.map(control => control as FormGroup);
  }

  addNewBeneficiary() {
    this.beneficiaries.push(this.getPrimaryBeneficiaryFields());
    this.updatePaValue();
  }

  updatePaValue() {
    const pa = 100 / this.beneficiaries.length;
    this.beneficiaries.controls.forEach(control => {
      const t = control.get('details.percentageAssigned') as FormControl;
      if(t) t.setValue(pa);
    });
  }

  removeNewBeneficiary(index: number) {
    this.beneficiaries.removeAt(index);
    this.updatePaValue();
  }

  private validatePercentageSum(control: AbstractControl): ValidationErrors | null {
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

  getReviewData() {
    return this.beneficiaries.value;
  }

  getName(info: any): string {
    if (info.type === 'TRUST') {
      return info?.details?.trustName ?? 'Trust Name Not Available';
    }
  
    const firstName = info?.details?.firstName ?? '';
    const middleName = info?.details?.middleName ?? '';
    const lastName = info?.details?.lastName ?? '';
  
    // Joining the names with a space and filtering out empty strings
    const fullName = [firstName, middleName, lastName].filter(name => name.trim() !== '').join(' ');
  
    return fullName !== '' ? fullName : 'Name Not Available';
  }

  getFormatDate(date: DateInfo): string| null {
    if(!date) return null;
    return formatCustomDate(date);
  }

  toggleReviewPage(value: boolean): void {
    this.showReviewPage = value;
  }

  finalFormSubmit() {
    alert("Form submitted..");
  }
}
