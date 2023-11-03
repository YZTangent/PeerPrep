import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../_services/history.service';
import { QuestionService } from '../_services/question.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  attempts: any;
  err: any;
  questions: any;
  constructor(public historyService: HistoryService, public questionService: QuestionService){}

  ngOnInit() {
    this.questions = {};
    this.questionService.getAllQuestions().subscribe(res => {
      res.forEach((element: { questionId: string | number; }) => {
        this.questions[element.questionId] = element;
      });
      this.completeUserHistory();
    })
    
  }

  completeUserHistory() {
    this.historyService.readAllHistory().subscribe(res => {
      this.attempts = res;
    }, err => {
      this.err = err.error?.message;
    })
  }

}
