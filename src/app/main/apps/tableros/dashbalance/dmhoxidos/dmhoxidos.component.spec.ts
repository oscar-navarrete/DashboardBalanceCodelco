import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmhoxidosComponent } from './dmhoxidos.component';

describe('DmhoxidosComponent', () => {
  let component: DmhoxidosComponent;
  let fixture: ComponentFixture<DmhoxidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmhoxidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmhoxidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
