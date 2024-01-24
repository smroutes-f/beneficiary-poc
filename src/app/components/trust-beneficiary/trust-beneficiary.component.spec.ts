import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustBeneficiaryComponent } from './trust-beneficiary.component';

describe('TrustBeneficiaryComponent', () => {
  let component: TrustBeneficiaryComponent;
  let fixture: ComponentFixture<TrustBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustBeneficiaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrustBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
