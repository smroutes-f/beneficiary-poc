import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';

import { CapitalizePipe } from '@app/utils/capitalize.pipe';
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
export class HomeComponent implements OnInit{
  showReviewPage: boolean = false;
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
  }

  ngOnInit(): void {
    this.open();
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
}
