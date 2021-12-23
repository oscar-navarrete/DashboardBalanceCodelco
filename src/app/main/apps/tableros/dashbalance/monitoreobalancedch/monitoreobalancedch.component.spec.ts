import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancedchComponent } from './monitoreobalancedch.component';

describe('MonitoreobalancedchComponent', () => {
  let component: MonitoreobalancedchComponent;
  let fixture: ComponentFixture<MonitoreobalancedchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancedchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancedchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
