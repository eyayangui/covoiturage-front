import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletMapsComponent } from './leaflet-maps.component';

describe('LeafletMapsComponent', () => {
  let component: LeafletMapsComponent;
  let fixture: ComponentFixture<LeafletMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeafletMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeafletMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
