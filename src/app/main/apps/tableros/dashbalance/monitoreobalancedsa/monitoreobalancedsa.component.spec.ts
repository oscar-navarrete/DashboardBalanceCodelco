import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreobalancedsaComponent } from './monitoreobalancedsa.component';

describe('MonitoreobalancedsaComponent', () => {
  let component: MonitoreobalancedsaComponent;
  let fixture: ComponentFixture<MonitoreobalancedsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreobalancedsaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreobalancedsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
