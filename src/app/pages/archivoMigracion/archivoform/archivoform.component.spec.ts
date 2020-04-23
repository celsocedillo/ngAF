import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoformComponent } from './archivoform.component';

describe('ArchivoformComponent', () => {
  let component: ArchivoformComponent;
  let fixture: ComponentFixture<ArchivoformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
