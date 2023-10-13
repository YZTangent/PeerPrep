import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollabService } from '../_services/collab.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css']
})
export class CollabComponent implements OnInit {

  private roomId: any;
  private difficulty: any;
  private language: any;

  private editor: any;
  public editorOptions = { theme: 'vs-dark', language: '' };
  public code: string = '';

  constructor(
    private route: ActivatedRoute,
    private collabService: CollabService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    console.log(`Created room ${this.roomId}.`)
    this.difficulty = this.route.snapshot.paramMap.get('difficulty');
    this.language = this.route.snapshot.paramMap.get('language');
    this.language = this.language.toLowerCase();
    console.log(`Setting language to ${this.language}`);
    this.editorOptions.language = this.language;
    this.collabService.joinRoom(this.roomId);
  }

  // Expose editor interface
  onInit(editor: any) {
    this.editor = editor;

    // Emit change events onDidChangeModelContent
    this.editor.onDidChangeModelContent((e: any) => {
      this.collabService.emitChange(e);
    })

    // Consume and apply change events to model
    this.collabService.getChange().subscribe((change: any) => {
      if (change) {
        console.log(`Applying change ${change}`);
        this.editor.getModel().applyEdits(change.changes);        
      }
    })
  }
}
