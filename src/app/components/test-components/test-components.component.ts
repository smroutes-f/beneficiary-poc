import { Component } from '@angular/core';

@Component({
  selector: 'app-test-components',
  standalone: true,
  imports: [],
  templateUrl: './test-components.component.html',
  styleUrl: './test-components.component.scss'
})
export class TestComponentsComponent {

  beneficiariesForm: any = {
    beneficiaries: []
  };

  primaryBeneficiarySelectOptions = {
    "SPOUSE": "Spouse",
    "NON_SPOUSE": "Non Spouse",
    "TRUST": "TRUST",
  };

  constructor() {
    this.beneficiariesForm.beneficiaries.push({
      type: ''
    });
  }

  get beneficiaries() {
    return this.beneficiariesForm.beneficiaries;
  }

  addNewBeneficiary(): void {
    this.beneficiariesForm.beneficiaries.push({
      type: ''
    });

    this.updatePercentageAssigned();
  }

  getInitialPaValue(): number {
    const t = this.beneficiaries;
    return 100 / t.length;
  }

  updatePercentageAssigned() {
    this.beneficiariesForm.beneficiaries.forEach((beneficiary: any) => {
      beneficiary.details.percentageAssigned = this.getInitialPaValue();
    });
  }

  removeNewBeneficiary(index: number): void {
    this.beneficiariesForm.beneficiaries.splice(index, 1); 
    this.updatePercentageAssigned();
  }

  updateTypeValue(val: any, i: any): void {
    this.beneficiaries[i].type = val;

    if(this.isSNSField(val)) {
      this.beneficiaries[i].details = {
        fullName: '',
        dateOfBirth: {},
        percentageAssigned: 100
      }
    }
    else if(this.isTrustField(val)) {
      this.beneficiaries[i].details = {
        trustName: '',
        dateOfEstablished: {},
        percentageAssigned: 100
      }
    }
  }

  updateFullName(val: any, i: any) {
    this.beneficiaries[i].details.fullName = val;
  }

  updateDob(val: any, i: any) {
    this.beneficiaries[i].details.dateOfBirth = val;
  }

  updatePa(val: any, i: any) {
    this.beneficiaries[i].details.pa = val;
  }

  updateTrustName(val: any, i: any) {
    this.beneficiaries[i].details.trustName = val;
  }

  updateEstablished(val: any, i: any) {
    this.beneficiaries[i].details.dateOfEstablished = val;
  }


  isSNSField(type: string): boolean {
    if(type === this.primaryBeneficiarySelectOptions.SPOUSE || type === this.primaryBeneficiarySelectOptions.NON_SPOUSE) {
      return true;
    }

    return false;
  }

  isTrustField(type: string): boolean {
    if(type === this.primaryBeneficiarySelectOptions.TRUST) {
      return true;
    }

    return false;
  }

  getBeneficiariesCount(): number {
    return this.beneficiaries.length;
  }
}
