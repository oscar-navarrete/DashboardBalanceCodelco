import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancedgmComponent } from './monitoreobalancedgm.component';

describe('MonitoreobalancedgmComponent', () => {
  let component: MonitoreobalancedgmComponent;
  let fixture: ComponentFixture<MonitoreobalancedgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancedgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancedgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
