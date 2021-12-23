import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancedmhComponent } from './monitoreobalancedmh.component';

describe('MonitoreobalancedmhComponent', () => {
  let component: MonitoreobalancedmhComponent;
  let fixture: ComponentFixture<MonitoreobalancedmhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancedmhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancedmhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
