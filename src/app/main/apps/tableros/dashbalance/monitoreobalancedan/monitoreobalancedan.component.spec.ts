import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancedanComponent } from './monitoreobalancedan.component';

describe('MonitoreobalancedanComponent', () => {
  let component: MonitoreobalancedanComponent;
  let fixture: ComponentFixture<MonitoreobalancedanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancedanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancedanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
