
import { HumanBeneficiaryComponent } from "@app/components/human-beneficiary/human-beneficiary.component"
import { TrustBeneficiaryComponent } from "@app/components/trust-beneficiary/trust-beneficiary.component"

export enum BeneficiaryTypes {
    SPOUSE = "SPOUSE",
    NON_SPOUSE = "NON_SPOUSE",
    TRUST = "TRUST"
}

export const BeneficiariesComponents: Record<string, any> = {
    [BeneficiaryTypes.SPOUSE]: HumanBeneficiaryComponent,
    [BeneficiaryTypes.NON_SPOUSE]: HumanBeneficiaryComponent,
    [BeneficiaryTypes.TRUST]: TrustBeneficiaryComponent
}