import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancertComponent } from './monitoreobalancert.component';

describe('MonitoreobalancertComponent', () => {
  let component: MonitoreobalancertComponent;
  let fixture: ComponentFixture<MonitoreobalancertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
