import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollabComponent } from './collab.component';
import { CollabService } from '../_services/collab.service';
import { RouterTestingModule } from "@angular/router/testing";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

describe('CollabComponent', () => {
  let component: CollabComponent;
  let fixture: ComponentFixture<CollabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, MatCardModule, MatIconModule, MonacoEditorModule],
      declarations: [CollabComponent],
      providers: [CollabService]
    });
    fixture = TestBed.createComponent(CollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
