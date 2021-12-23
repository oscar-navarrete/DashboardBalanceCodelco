import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpibalanceVW2Component } from './kpibalance-vw2.component';

describe('KpibalanceVW2Component', () => {
  let component: KpibalanceVW2Component;
  let fixture: ComponentFixture<KpibalanceVW2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpibalanceVW2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpibalanceVW2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
