import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tangram3dComponent } from './tangram3d.component';

describe('Tangram3dComponent', () => {
  let component: Tangram3dComponent;
  let fixture: ComponentFixture<Tangram3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tangram3dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tangram3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
