import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollabComponent } from './collab.component';
import { CollabService } from '../_services/collab.service';
import { RouterTestingModule } from "@angular/router/testing";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { ChatComponent } from './chat/chat.component';

const mockMonacoEditorConfig = {
  defaultOptions: {
    theme: 'vs-dark',
    language: 'javascript',
  },
};

describe('CollabComponent', () => {
  let component: CollabComponent;
  let fixture: ComponentFixture<CollabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, MatCardModule, MatIconModule, MonacoEditorModule],
      declarations: [CollabComponent, ChatComponent],
      providers: [
        CollabService,
        {
          provide: NGX_MONACO_EDITOR_CONFIG,
          useValue: mockMonacoEditorConfig,
        },
      ],
    });
    fixture = TestBed.createComponent(CollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
