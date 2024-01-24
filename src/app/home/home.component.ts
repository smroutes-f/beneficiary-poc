import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ModalDismissReasons,
  NgbModalConfig,
  NgbModal,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

import { TypeValidator } from '@app/utils/TypeValidator';
import {
  BeneficiaryTypes
} from '@app/utils/constants';
import { BeneficiaryComponent } from '@app/components/beneficiary/beneficiary.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BeneficiaryComponent
  ],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  
  @ViewChild('otherFormFields', { read: ViewContainerRef }) myContainerRef: ViewContainerRef | undefined;

  closeResult = '';
  beneficiariesForm: FormGroup;
  otherFields: Array<any> = [];

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

    this.beneficiariesForm = this.fb.group({
      beneficiaries: this.fb.array([
        this.getPrimaryBeneficiaryFields()
      ]),
    });
  }

  getPrimaryBeneficiaryFields() {
    return  this.fb.group({
      type: [null, TypeValidator(Object.keys(BeneficiaryTypes))],
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        size: 'lg',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  onSubmit() {
    console.log('Form Submitted: ', this.beneficiariesForm.value);
    console.log(this.beneficiariesForm.valid);
    this.beneficiariesForm.markAllAsTouched();
  }

  get beneficiaries(): FormArray {
    return this.beneficiariesForm.get('beneficiaries') as FormArray;
  }

  getArrayElements(): FormGroup[] {
    return this.beneficiaries.controls.map(control => control as FormGroup);
  }

  addNewBeneficiary() {
    this.beneficiaries.push(this.getPrimaryBeneficiaryFields());
  }

  removeNewBeneficiary(index: number) {
    this.beneficiaries.removeAt(index);
  }
}
