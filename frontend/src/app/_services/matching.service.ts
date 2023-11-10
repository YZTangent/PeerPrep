import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_API } from '../_api/backend.api';

const API_URL = BACKEND_API + "matching/"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
    providedIn: 'root'
  })
  
  export class MatchingService {
    
    constructor(private http: HttpClient){}

    enqueue(obj: any): Observable<any> {
        return this.http.post(API_URL + "enqueue", obj, httpOptions)
    }

    dequeue(id: any): Observable<any> {
        return this.http.post(API_URL + "dequeue", {userid: id}, httpOptions)
    }

    getQueueLength(): Observable<any> {
        return this.http.get(API_URL + "getLength", httpOptions)
    }
  }