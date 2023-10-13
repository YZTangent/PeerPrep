import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class CollabService implements OnInit {

  private socket = io('http://127.0.0.1:8004');

  public isLocalEvent$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public change$: BehaviorSubject<any> = new BehaviorSubject(null);
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
    this.socket.on("connect", () => {
      console.log("socket connected");
    })    
  }

  constructor() {}

  public joinRoom(roomId: string) {
    console.log(`Joining room ${roomId}`);
    this.socket.emit("join", roomId);
  }

  public emitChange(change: any) {
    if (this.isLocalEvent$.value) {
      console.log(`Emitting change:\n${change}`);
      this.socket.emit("change", change);
    } else {
      // Stop supressing emission of change event
      console.log("Ignoring local change");
      this.isLocalEvent$.next(true);
    }
  }

  public getChange = () => {
    this.socket.on("change", (change) => {
      console.log(`Consuming change:\n${change}`);
      // Supress emission of change event to prevent loops
      this.isLocalEvent$.next(false);
      this.change$.next(change);
    })

    return this.change$.asObservable();
  }

  public emitMessage(message: string) {
    console.log(`Emitting message:\n${message}`);
    this.socket.emit("message", message);
    this.message$.next(message);
  }

  public getMessage = () => {
    this.socket.on("message", (message) => {
      console.log(`Consuming message:\n${message}`);
      this.message$.next(message);
    })

    return this.message$.asObservable();
  }
}