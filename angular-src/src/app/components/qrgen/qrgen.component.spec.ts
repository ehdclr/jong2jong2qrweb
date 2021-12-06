import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrgenComponent } from './qrgen.component';

describe('QrgenComponent', () => {
  let component: QrgenComponent;
  let fixture: ComponentFixture<QrgenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrgenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
