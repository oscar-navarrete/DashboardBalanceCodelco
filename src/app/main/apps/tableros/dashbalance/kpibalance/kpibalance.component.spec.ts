import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpibalanceComponent } from './kpibalance.component';

describe('KpibalanceComponent', () => {
  let component: KpibalanceComponent;
  let fixture: ComponentFixture<KpibalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpibalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpibalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
