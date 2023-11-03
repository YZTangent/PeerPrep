import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollabService } from '../_services/collab.service';
import { QuestionService } from '../_services/question.service';
import { HistoryService } from '../_services/history.service';
import { StorageService } from '../_services/storage.service';
import { MatchingService } from '../_services/matching.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collabService: CollabService,
    private questionService: QuestionService,
    private historyService: HistoryService,
    private storageService: StorageService,
    private matchingService: MatchingService
  ) {}

  currUser = this.storageService.getUser().username;

  ngOnInit(): void {
    console.log(`Set complexity to ${this.complexity}.`);
    this.complexity = this.route.snapshot.paramMap.get('difficulty');
    console.log(`Set language to ${this.language}`);
    this.language = this.route.snapshot.paramMap.get('language');
    this.language = this.language.toLowerCase();
    this.editorOptions.language = this.language;
    console.log(`Joining room ${this.roomId}.`)
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.collabService.joinRoom(this.roomId);
    this.collabService.getQuestion().subscribe((question: any) => {
      console.log(`Updating question ${question}`);
      this.question = question;
      this.getHistory();
    })
    this.getQuestion();
    this.getQuestions();
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

    this.editor.onDidDispose((e: any) => {
      console.log(`Disposing monaco-editor ${this.editor}.`);
    })
  }

  public getQuestion() {
    this.collabService.emitRandomQuestion(this.complexity);
  }

  public leaveRoom(): void {
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
    this.collabService.emitQuestion(q);
    this.toggleQuestionView();
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
    this.historyService.saveHistory(attempt).subscribe(res => {
      console.log(res)
    },
    err => {
      console.log("An error occurred while saving attempt: " + err.message)
    })
  }

  viewAttempt(attempt: any) {
    this.editor.getModel().setValue(attempt.solution);
  }
}
