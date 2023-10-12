import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class CollabService implements OnInit {

  private socket = io('http://127.0.0.1:8004');

  public code$: BehaviorSubject<string> = new BehaviorSubject('');
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

  public emitCode(code: string) {
    console.log(`Emitting codeChange:\n${code}\n`);
    this.socket.emit("codeChange", code)
  }

  public getCode = () => {
    this.socket.on("codeChange", (code) => {
      this.code$.next(code);
    })

    return this.code$.asObservable();
  }

  public emitMessage(message: string) {
    console.log(`Emitting message:\n${message}\n`);
    this.socket.emit("message", message);
    this.message$.next(message);
  }

  public getMessage = () => {
    this.socket.on("message", (message) => {
      this.message$.next(message);
    })

    return this.message$.asObservable();
  }
}