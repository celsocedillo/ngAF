import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaformComponent } from './actaform.component';

describe('ActaformComponent', () => {
  let component: ActaformComponent;
  let fixture: ComponentFixture<ActaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
