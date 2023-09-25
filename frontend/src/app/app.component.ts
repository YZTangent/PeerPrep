import { Component, OnInit } from '@angular/core';

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
  
  ngOnInit(): void {
    this.counter = 0;
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
