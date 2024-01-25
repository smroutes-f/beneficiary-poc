import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ModalDismissReasons,
  NgbDatepickerModule, NgbModal, NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';

import { TypeValidator } from '@app/utils/TypeValidator';
import { CapitalizePipe } from '@app/utils/capitalize.pipe';
import {
  BeneficiaryTypes
} from '@app/utils/constants';
import { BeneficiaryComponent } from '@app/components/beneficiary/beneficiary.component';
import { DisplayOption, DisplayOptionConfigContent } from '@app/utils/common';
import { ValidatePercentageSum } from '@app/utils/PercentageSumValidator';
import { ReviewPageComponent } from '@app/components/review-page/review-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BeneficiaryComponent,
    CapitalizePipe,
    ReviewPageComponent
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
  showReviewPage: boolean = false;
  displayOption: DisplayOption;

  constructor(
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {

    this.beneficiariesForm = this.fb.group({
      beneficiaries: this.fb.array(
        [ this.getPrimaryBeneficiaryFields()],
        { validators: [ ValidatePercentageSum() ] }),
    });

    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

    this.displayOption = {
      isReviewPage: false,
      config: {
        inputPage: {
          headerText: '&lt;Account&gt; is missing a primary beneficiary',
          description: `Now that you&#039;ve transferred money to this account, let&#039;s make
          sure you secure your assets with a beneficiary. Naming a beneficiary is
          free and it only takes a few minutes.`
        },
        reviewPage: {
          headerText: 'Dobule check the details before naming your beneficiaries.',
          description: `Please review the information beow for accuracy.It will be used to
          identify your beneficiaries when you pass away.`
        }
      }
    }
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

  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
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

  getReviewData() {
    return this.beneficiaries.value;
  }

  toggleReviewPage(value: boolean): void {
    this.showReviewPage = value;
  }

  getDisplayOption(): DisplayOptionConfigContent {
    if(this.displayOption.isReviewPage) {
      return this.displayOption.config.reviewPage;
    }

    return this.displayOption.config.inputPage;
  }
}
