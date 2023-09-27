import { Component, OnInit } from '@angular/core';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  questions: any[] = [];
  currentIndex: number = -2;
  currentQuestion: any = null;
  counter!: number;
  bottomView = true;
selector: any;

  constructor(private questionService: QuestionService) {}
  
  ngOnInit(): void {
    this.getQuestions();
    if (!this.questions) {
      this.questions = [];
    }
    this.counter = this.questions.length;
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
      console.log(res);
      this.questions = res;
    })
  }

  saveQuestions() {
      localStorage.setItem("qs", JSON.stringify(this.questions));
  }

  view(i: number) {
      this.currentIndex = i;
  }

  toggleView(i: any) {
    this.bottomView = !this.bottomView;
    if (i) {
      this.currentIndex = i;
      this.currentQuestion = this.questions[i]
    } else {
      this.currentIndex = -1;
    }
    console.log(this.currentIndex, this.currentQuestion);
  }

  addItem(formData: any) {
      let obj = Object.assign({}, formData.value);
      console.log(obj)
      this.questionService.saveQuestion(this.counter, obj).subscribe((res) => {
        console.log(res)
      })
      obj["id"] = this.counter.valueOf() + 1
      this.counter++;
      this.questions?.push(obj)
      this.saveQuestions();
      
  }

  editItem(index: number, formData: any) {
    let obj = Object.assign({}, formData.value);
    obj["id"] = index + 1;
    this.questions[index] = obj;
  }

  deleteItem(i: number) {
    this.questions.splice(i, 1);
  }
  
}
