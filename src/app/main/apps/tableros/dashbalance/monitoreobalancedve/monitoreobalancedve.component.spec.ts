import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancedveComponent } from './monitoreobalancedve.component';

describe('MonitoreobalancedveComponent', () => {
  let component: MonitoreobalancedveComponent;
  let fixture: ComponentFixture<MonitoreobalancedveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancedveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancedveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
