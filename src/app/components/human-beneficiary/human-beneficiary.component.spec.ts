import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBeneficiaryComponent } from './human-beneficiary.component';

describe('HumanBeneficiaryComponent', () => {
  let component: HumanBeneficiaryComponent;
  let fixture: ComponentFixture<HumanBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBeneficiaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HumanBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
