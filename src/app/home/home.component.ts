import {
  Component,
  QueryList,
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
import { CapitalizePipe } from '@app/utils/capitalize.pipe';
import {
  BeneficiaryTypes,
  BeneficiariesComponents
} from '@app/utils/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CapitalizePipe,
  ],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  
  @ViewChild('otherFormFields', { read: ViewContainerRef }) myContainerRef: ViewContainerRef | undefined;

  closeResult = '';
  allBeneficiaryTypes: string[];
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

    this.allBeneficiaryTypes = Array.from(Object.values(BeneficiaryTypes));

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

  onSelectChange(event: any, arrayIndex: number) {
    const selectedValue = event.target.value;
    if(selectedValue === 'null') {
      this.removeComponent(arrayIndex);
      return;
    }

    this.loadDynamicComponent(selectedValue, arrayIndex)
  }

  removeComponent(arrayIndex: number) {
    if(this.otherFields[arrayIndex]) {
      this.otherFields[arrayIndex].destroy();
    }
  }

  loadDynamicComponent(type: string, arrayIndex: number) {

    this.removeComponent(arrayIndex);

    this.otherFields[arrayIndex] = this.myContainerRef?.createComponent(
      BeneficiariesComponents[type]
    );

    // Access the extra component's instance for interaction
    const extraComponentInstance = this.otherFields[arrayIndex].instance;
    const t = this.beneficiaries.at(arrayIndex) as FormGroup;
    extraComponentInstance.fromGroup = t;
    extraComponentInstance.fieldIndex = arrayIndex;

    // componentRef.instance.myOutput.subscribe(event => {
    //   console.log('Event from extra component:', event);
    // }); // Listen to output events
  }

  addNewBeneficiary() {
    this.beneficiaries.push(this.getPrimaryBeneficiaryFields());
  }
}
