import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDANComponent } from './tabla-dan.component';

describe('TablaDANComponent', () => {
  let component: TablaDANComponent;
  let fixture: ComponentFixture<TablaDANComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDANComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDANComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
