import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css']
})
export class CollabComponent {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string = 'function x() {\n\tconsole.log("Hello world!");\n}';
}
