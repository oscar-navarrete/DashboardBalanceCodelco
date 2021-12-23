import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoVW3Component } from './monitoreo-vw3.component';

describe('MonitoreoVW3Component', () => {
  let component: MonitoreoVW3Component;
  let fixture: ComponentFixture<MonitoreoVW3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoVW3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoVW3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
