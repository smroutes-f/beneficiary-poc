import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GreaterThanZeroValidator } from '@app/utils/GreaterThanZeroValidator';
import {
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-human-beneficiary',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './human-beneficiary.component.html',
  styleUrl: './human-beneficiary.component.scss'
})
export class HumanBeneficiaryComponent {

  @Input() fromGroup: FormGroup = new FormGroup({details: this.fb.group({})});
  @Input() fieldIndex: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.fromGroup?.addControl('details', this.fb.group({
      firstName: ['', Validators.required],
      middleName: [],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      percentageAssigned: [100, [Validators.required, GreaterThanZeroValidator()]]
    }));

  }

  get details() {
    return this.fromGroup.get('details') as FormGroup;
  }

  isInValidField (field: string) {
    return this.details.get(field)?.invalid && this.details.get(field)?.touched;
  }

  isValidField (field: string) {
    return this.details.get(field)?.valid && this.details.get(field)?.touched;
  }

  getBeneficiariesCount() {
    const root = this.fromGroup.root.get('beneficiaries') as FormArray;
    return root.length;
  }

  hasFieldSpecificError (field: string, error: string) {
    return this.details.get(field)?.hasError(error);
  }

  getErrorMessages(controlName: string): string {
    const control = this.details.get(controlName);

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
}
