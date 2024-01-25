import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  BeneficiaryFormData,
  BeneficiaryFormDataElement,
  HumarnBeneficiaryFormData,
  TrustBeneficiaryFormData,
  formatCustomDate,
} from '@app/utils/common';
import { CapitalizePipe } from '@app/utils/capitalize.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [CapitalizePipe, CommonModule],
  templateUrl: './review-page.component.html',
  styleUrl: './review-page.component.scss',
})
export class ReviewPageComponent {
  @Input() reviewData: BeneficiaryFormData;
  @Output() backButtonClicked = new EventEmitter<boolean>();

  constructor() {
    this.reviewData = [];
  }

  getName(info: BeneficiaryFormDataElement): string {
    if (info.type === 'TRUST') {
      const TrustData = info.details as TrustBeneficiaryFormData;
      return TrustData.trustName ?? 'Trust Name Not Available';
    }

    const HumanData = info.details as HumarnBeneficiaryFormData;
    const firstName = HumanData.firstName ?? '';
    const middleName = HumanData.middleName ?? '';
    const lastName = HumanData.lastName ?? '';

    // Joining the names with a space and filtering out empty strings
    const fullName = [firstName, middleName, lastName]
      .filter((name) => name.trim() !== '')
      .join(' ');

    return fullName !== '' ? fullName : 'Name Not Available';
  }

  getFormatDate(info: BeneficiaryFormDataElement): string | null {
    if (info.type === 'TRUST') {
      const TrustData = info.details as TrustBeneficiaryFormData;
      return formatCustomDate(TrustData.established);
    }

    const HumanData = info.details as HumarnBeneficiaryFormData;
    return formatCustomDate(HumanData.dateOfBirth);
  }
}
