import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class CollabService implements OnInit {

  private socket = io('http://127.0.0.1:8004');

  public code$: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
    this.socket.on("connect", () => {
      console.log("socket connected");
    })    
  }

  constructor() {}

  public joinRoom(roomId: string) {
    console.log(`Joining room ${roomId}`);
    this.socket.emit("join", {
      roomId: roomId
    });
  }

  public emitCode(roomId: string, code: string) {
    console.log(`Emitting codeChange:\n${code}\nto room ${roomId}.`);
    this.socket.emit("codeChange", {
      roomId: roomId,
      code: code
    })
    this.code$.next(code);
  }

  public getCode = () => {
    this.socket.on("codeChange", (event) => {
      this.code$.next(event.code);
    })

    return this.code$.asObservable();
  }
}