import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const api = "http://127.0.0.1:8003/matching"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
    providedIn: 'root'
  })
  
  export class MatchingService {
    
    constructor(private http: HttpClient){}

    enqueue(obj: any): Observable<any> {
        return this.http.post(api + "/enqueue", obj, httpOptions)
    }

    getQueueLength(): Observable<any> {
        return this.http.get(api + "/getLength", httpOptions)
    }
  }