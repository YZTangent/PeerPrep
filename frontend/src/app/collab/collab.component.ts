import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollabService } from '../_services/collab.service';
import { QuestionService } from '../_services/question.service';
import { HistoryService } from '../_services/history.service';
import { StorageService } from '../_services/storage.service';
import { MatchingService } from '../_services/matching.service';
import { HostListener } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeQuestionDialogComponent } from './change-question-dialog/change-question-dialog.component';

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css'],
  providers: [ CollabService ]
})
export class CollabComponent implements OnInit, AfterViewInit {

  private roomId: any;
  private complexity: any;
  private language: any;
  public question: any;
  public attempts: any;

  private editor: any;
  public editorOptions = { theme: 'vs-dark', language: '' };

  searchResults: any;
  questionView: boolean = true;
  solo: boolean = false;

  constructor(
    private router: Router,
    private collabService: CollabService,
    private questionService: QuestionService,
    private historyService: HistoryService,
    private storageService: StorageService,
    private matchingService: MatchingService,
    private dialog: MatDialog
  ) {}

  currUser = this.storageService.getUser().username;

  @HostListener('window:popstate', ['$event']) onPopState(event: any) {
    console.log('Back button pressed. Exiting collaboration space...');
    this.leaveRoom();
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: any) {
    console.log('Refresh pressed. Exiting collaboration space...');
    this.leaveRoom();
    return "Do you want save your changes before exiting?"
  }

  ngOnInit(): void {
    const sessionState = history.state;
    if (!sessionState.roomId || !sessionState.difficulty || !sessionState.language) {
      // On refresh, or access without match
      this.router.navigate(["/match"]);
    } else {
      this.complexity = sessionState.difficulty;
      console.log(`Set complexity to ${this.complexity}.`);
      this.language = sessionState.language;
      console.log(`Set language to ${this.language}`);
      this.language = this.language.toLowerCase();
      this.editorOptions.language = this.language;
      this.roomId = sessionState.roomId;
      console.log(`Joining room ${this.roomId}.`)
      this.collabService.joinRoom(this.roomId);
      this.roomId == this.currUser ? this.solo = true : this.solo = false;
      this.collabService.getQuestion().subscribe((question: any) => {
        console.log(`Updating question ${question.questionTitle}`);
        this.question = question;
        this.questionView = true;
        this.getHistory();
      })
      this.getQuestion();
      this.getQuestions();  
    }
  }

  ngAfterViewInit(): void {
    
  }

  getHistory() {
    this.historyService.readHistory({questionId: this.question.questionId, userId: this.currUser}).subscribe(res => {
      this.attempts = res
    }, err => {
      console.log("An error occurred while retrieving past attempts: " + err.message)
      this.attempts = []
    })
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
      this.searchResults = res;
    })
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

    this.collabService.getRequest().subscribe((request: any) => {
      console.log(request)
      console.log(request[0] == 1)
      if (request[0] == 1) {
          this.openChangeQDialog(request[1])
      }
    })

    this.editor.onDidDispose((e: any) => {
      console.log(`Disposing monaco-editor ${this.editor}.`);
    })
  }

  public openChangeQDialog(question: any): void {
    const dialogRef = this.dialog.open(ChangeQuestionDialogComponent, { 
      minWidth: '25vw',
      minHeight: '25vh',
      hasBackdrop: true,
      disableClose: true
    });
    dialogRef.componentInstance.confirmMessage = "Your partner requested to change to this question - " + question.questionTitle
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collabService.emitQuestion(question);
      } else {
        this.collabService.emitMessage(this.currUser + " rejected your request to change question!");
      }
    });
  }

  public async getQuestion() {
    this.collabService.emitRandomQuestion(this.complexity);
  }

  public async getNewQuestion() {
    // has issues if two sessions are both on Chrome
    if (this.solo) {
      this.collabService.emitRandomQuestion(this.complexity);
    } else {
      this.collabService.getRandomQuestion(this.complexity).then(question => {
        this.collabService.requestChangeOfQuestion(question);
      });
    }
  }

  public leaveRoom(): void {
    this.collabService.emitMessage("Your partner has left the room");
    history.replaceState(
      {
        roomId: undefined,
        difficulty: undefined,
        language: undefined 
      },
      '',
      '/collab'
    )
    this.router.navigate(["/home"])
  }

  updateSearchResults(s: string) {
    this.questionService.searchQuestions(s).subscribe(res => {
      this.searchResults = res;
    }, err => {
      console.log(err);
    })
  }

  toggleQuestionView() {
    this.questionView = !this.questionView;
  }

  pullUpQuestion(q: Object) {
    if (this.solo) {
      this.collabService.emitQuestion(q);
    } else {
      this.collabService.requestChangeOfQuestion(q);
    }
  }

  saveAttempt() {
    // save code with userId and questionId
    var attempt = {questionId: this.question.questionId,
      userId: this.currUser,
      solution: this.editor.getValue(),
      language: this.language,
      user_id1: this.currUser,
      user_id2: this.matchingService.matchId
    }
    if (this.solo) {
      attempt.user_id2 = "";
    }
    this.historyService.saveHistory(attempt).subscribe(res => {
      var newAttempt = {
        questionId: this.question.questionId,
        userId: this.currUser,
        solution: this.editor.getValue(),
        language: this.language,
        userId2: this.matchingService.matchId
      }
      this.attempts.push(newAttempt)
    },
    err => {
      console.log("An error occurred while saving attempt: " + err.message)
    })
  }
}
