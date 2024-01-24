import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from '@app/utils/capitalize.pipe';
import { BeneficiariesComponents, BeneficiaryTypes } from '@app/utils/constants';

@Component({
  selector: 'app-beneficiary',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CapitalizePipe, 
    CommonModule
  ],
  templateUrl: './beneficiary.component.html',
  styleUrl: './beneficiary.component.scss'
})
export class BeneficiaryComponent {
  @Input() fieldIndex: number = 0;
  @Input() items: FormGroup = new FormGroup({});
  @ViewChild('otherFormFields', { read: ViewContainerRef }) myContainerRef: ViewContainerRef | undefined;

  allBeneficiaryTypes: string[];
  otherFields: any;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.allBeneficiaryTypes = Array.from(Object.values(BeneficiaryTypes));
  }

  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    if(selectedValue === 'null') {
      this.removeComponent();
      return;
    }

    this.loadDynamicComponent(selectedValue, this.fieldIndex)
  }

  removeComponent() {
    if(this.otherFields) {
      this.otherFields.destroy();
      this.items.removeControl('details')
    }
  }

  loadDynamicComponent(type: string, arrayIndex: number) {

    this.removeComponent();

    this.otherFields = this.myContainerRef?.createComponent(
      BeneficiariesComponents[type]
    );

    // Access the extra component's instance for interaction
    const extraComponentInstance = this.otherFields.instance;
    extraComponentInstance.fromGroup = this.items;
    extraComponentInstance.fieldIndex = arrayIndex;

    // componentRef.instance.myOutput.subscribe(event => {
    //   console.log('Event from extra component:', event);
    // }); // Listen to output events
    this.cdr.detectChanges();
  }

  isInValidField (field: string) {
    return this.items.get(field)?.invalid && this.items.get(field)?.touched;
  }

  isValidField (field: string) {
    return this.items.get(field)?.valid && this.items.get(field)?.touched;
  }
}
