import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeQuestionDialogComponent } from './change-question-dialog.component';

describe('ChangeQuestionDialogComponent', () => {
  let component: ChangeQuestionDialogComponent;
  let fixture: ComponentFixture<ChangeQuestionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeQuestionDialogComponent]
    });
    fixture = TestBed.createComponent(ChangeQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
