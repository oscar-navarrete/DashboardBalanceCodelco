import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoVW2Component } from './monitoreo-vw2.component';

describe('MonitoreoVW2Component', () => {
  let component: MonitoreoVW2Component;
  let fixture: ComponentFixture<MonitoreoVW2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoVW2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoVW2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
