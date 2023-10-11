import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollabService } from '../_services/collab.service';

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css']
})
export class CollabComponent implements OnInit {

  private roomId: any;

  public editorOptions = {theme: 'vs-dark', language: 'javascript'};
  public code: string = '';

  constructor(
    private route: ActivatedRoute,
    private collabService: CollabService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.collabService.joinRoom(this.roomId);
    this.collabService.getCode().subscribe((code: string) => {
      this.code = code;
    });
  }

  emitChange() {
    if(this.roomId) {
      this.collabService.emitCode(this.roomId, this.code);
    } else {
      console.log('Not connected to a session');
    }
  }
}
