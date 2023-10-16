import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const api = "http://127.0.0.1:8002/questions"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  constructor(private http: HttpClient) { }

  getAllQuestions(): Observable<any> {
    return this.http.get(
      api + '/all', 
      httpOptions
    );
  }

  getRandomQuestionWithComplexity(questionComplexity: string): Observable<any> {
    return this.http.get(
      api + '/random/' + questionComplexity, 
      httpOptions
    );
  }

  saveQuestion(question: any): Observable<any> {
    let newobj = Object.assign({}, question);
    return this.http.post(
        api,
        newobj,
        httpOptions
    )
  }

  editQuestion(question: any): Observable<any> {
    let newobj = Object.assign({}, question);
    return this.http.put(
        api + "/" + newobj.questionId.toString(),
        newobj,
        httpOptions
    )
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(
      api + "/" + id.toString(),
        httpOptions
    )
  }

}