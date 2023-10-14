import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollabService } from '../_services/collab.service';

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css'],
  providers: [ CollabService ]
})
export class CollabComponent implements OnInit {

  private roomId: any;
  private difficulty: any;
  private language: any;

  private editor: any;
  public editorOptions = { theme: 'vs-dark', language: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collabService: CollabService
  ) {}

  ngOnInit(): void {
    this.difficulty = this.route.snapshot.paramMap.get('difficulty');
    console.log(`Set difficulty to ${this.difficulty}.`)
    this.language = this.route.snapshot.paramMap.get('language');
    this.language = this.language.toLowerCase();
    console.log(`Set language to ${this.language}`);
    this.editorOptions.language = this.language;
    console.log(`Joining room ${this.roomId}.`)
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.collabService.joinRoom(this.roomId);
  }

  // Expose editor interface
  onInit(editor: any) {
    this.editor = editor;
    console.log(`Initialised monaco-editor ${this.editor}.`)

    // Emit change events onDidChangeModelContent
    this.editor.onDidChangeModelContent((e: any) => {
      console.log(e.changes);
      this.collabService.emitChange(e);
    })

    // Consume and apply change events to model
    this.collabService.getChange().subscribe((change: any) => {
      if (change) {
        console.log(`Applying change ${change}`);
        this.editor.getModel().applyEdits(change.changes);        
      }
    })

    this.editor.onDidDispose((e: any) => {
      console.log(`Disposing monaco-editor ${this.editor}.`);
    })
  }

  leaveRoom(): void {
    this.router.navigate(["/home"])
  }
}
