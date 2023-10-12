import { Component, OnInit } from '@angular/core';
import { CollabService } from '../../_services/collab.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  public message: string = '';
  public messageLog: string[] = [];

  constructor(
    private collabService: CollabService
  ) {}

  ngOnInit(): void {
    this.collabService.getMessage().subscribe((message: string) => {
      this.messageLog.push(message);
      setTimeout(() => this.scrollChat(), 10);
    })
  }

  emitMessage(): void {
    this.collabService.emitMessage(this.message);
    this.message = '';
  }

  scrollChat(): void {
    const scrollableContainer = document.getElementById("scrollable-container");
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  }
}
