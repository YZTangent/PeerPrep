import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const api = "http://127.0.0.1:8005/history"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class HistoryService {
  constructor(private http: HttpClient) { }

  readHistory(history: any): Observable<any> {
    let newobj = Object.assign({}, history);
    return this.http.get(
        api + "/" + newobj.questionId.toString() + "/" + newobj.userId.toString(),
        httpOptions
    );
  }

  saveHistory(history: any): Observable<any> {
    let newobj = Object.assign({}, history);
    return this.http.post(
        api + "/" + newobj.questionId.toString() + "/" + newobj.userId.toString(),
        newobj,
        httpOptions
    )
  }

  editHistory(history: any): Observable<any> {
    let newobj = Object.assign({}, history);
    return this.http.put(
        api + "/" + newobj.questionId.toString() + "/" + newobj.userId.toString(),
        newobj,
        httpOptions
    )
  }

  deleteHistory(id: number): Observable<any> {
    return this.http.delete(
        api + "/" + id.toString(),
        httpOptions
    )
  }
}