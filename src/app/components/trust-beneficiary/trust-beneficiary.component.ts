import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trust-beneficiary',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './trust-beneficiary.component.html',
  styleUrl: './trust-beneficiary.component.scss'
})
export class TrustBeneficiaryComponent {

  @Input() fromGroup: FormGroup = new FormGroup({details: this.fb.group({})});
  @Input() fieldIndex: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.fromGroup?.addControl('details', this.fb.group({
      trustName: ['', Validators.required],
      established: ['', Validators.required],
      percentageAssigned: [100, Validators.required]
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
}
