import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  questions: any[] = [];
  currentIndex: Number = 0;
  counter!: number;
  
  ngOnInit(): void {
    this.counter = 0;
  }

  saveQuestions() {
      localStorage.setItem("qs", JSON.stringify(this.questions));
  }

  view(i: number) {
      this.currentIndex = i;
  }

  addItem(formData: any) {
      let obj = Object.assign({}, formData.value);
      obj["id"] = this.counter.valueOf() + 1
      this.counter++;
      this.questions?.push(obj)
      this.saveQuestions();
  }

  editItem(index: number, formData: any) {
    this.questions[index] = formData;
  }

  deleteItem(i: number) {
    this.questions.splice(i, 1);
  }
  
}
