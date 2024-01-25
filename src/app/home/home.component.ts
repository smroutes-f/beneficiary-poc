import {
  ChangeDetectorRef,
  Component
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';

import { CapitalizePipe } from '@app/utils/capitalize.pipe';
import { DisplayOption, DisplayOptionConfigContent } from '@app/utils/common';
import { ReviewPageComponent } from '@app/components/review-page/review-page.component';
import { AddBeneficiaryComponent } from '@app/components/add-beneficiary/add-beneficiary.component';
import { ModalComponent } from '@app/components/modal/modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CapitalizePipe,
    ReviewPageComponent,
    AddBeneficiaryComponent,
  ],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showReviewPage: boolean = false;
  displayOption: DisplayOption;
  addBeneficiary!: AddBeneficiaryComponent;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    config.scrollable = true;

    this.displayOption = {
      isReviewPage: false,
      config: {
        inputPage: {
          headerText: '&lt;Account&gt; is missing a primary beneficiary',
          description: `Now that you&#039;ve transferred money to this account, let&#039;s make
          sure you secure your assets with a beneficiary. Naming a beneficiary is
          free and it only takes a few minutes.`,
        },
        reviewPage: {
          headerText:
            'Dobule check the details before naming your beneficiaries.',
          description: `Please review the information beow for accuracy.It will be used to
          identify your beneficiaries when you pass away.`,
        },
      },
    };
  }

  open() {
    const modal = this.modalService.open(ModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg',
    });

    modal.shown.subscribe(() => {
      this.addBeneficiary = modal.componentInstance.addBeneficiary;
      
      modal.componentInstance.closeModal.subscribe((reason: string) => {
        modal.close();
      });
    });
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

  getReviewData() {
    return null;
  }

  toggleReviewPage(value: boolean): void {
    this.showReviewPage = value;
    this.displayOption.isReviewPage = value;
  }

  getDisplayOption(): DisplayOptionConfigContent {
    if (this.displayOption.isReviewPage) {
      return this.displayOption.config.reviewPage;
    }

    return this.displayOption.config.inputPage;
  }
}
