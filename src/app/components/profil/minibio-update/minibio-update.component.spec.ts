import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinibioUpdateComponent } from './minibio-update.component';

describe('MinibioUpdateComponent', () => {
  let component: MinibioUpdateComponent;
  let fixture: ComponentFixture<MinibioUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinibioUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinibioUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
