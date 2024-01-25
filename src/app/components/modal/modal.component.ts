import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DisplayOption, DisplayOptionConfigContent } from '@app/utils/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddBeneficiaryComponent } from '@app/components/add-beneficiary/add-beneficiary.component';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [AddBeneficiaryComponent],
  providers: [NgbModal],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  displayOption: DisplayOption;

  @Output() closeModal = new EventEmitter<string>();
  @ViewChild('addBeneficiary') addBeneficiary!: AddBeneficiaryComponent;

  constructor() {
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

  getDisplayOption(): DisplayOptionConfigContent {
    if(this.displayOption.isReviewPage) {
      return this.displayOption.config.reviewPage;
    }

    return this.displayOption.config.inputPage;
  }

  closeCurrentModal(reason: string) {
    this.closeModal.emit(reason);
  }

  submitForm(): void {
    this.addBeneficiary?.onSubmit();
  }
}
