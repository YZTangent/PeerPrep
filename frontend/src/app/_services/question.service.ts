import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const api = "http://localhost:8002/questions"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  constructor(private http: HttpClient) { }

  getAllQuestions(): Observable<any> {
    return this.http.get(
      api + '/all', httpOptions
    );
  }

  saveQuestion(id: number, question: any): Observable<any> {
    let newobj = {questionId: id.toString(), questionTitle: question.name, questionDescription: question.description,
        questionCategory: question.category, questionComplexity: question.complexity}
    return this.http.post(
        api,
        newobj,
        httpOptions
    )

  }

}