import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { io } from 'socket.io-client';

@Injectable()

export class CollabService implements OnInit, OnDestroy {

  private socket = io('http://127.0.0.1:8004', {'forceNew': true});

  public isLocalEvent$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public change$: BehaviorSubject<any> = new BehaviorSubject(null);
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
    this.socket.on("connect", () => {
      console.log(`${this.socket.id} connected`);
    })
  }

  ngOnDestroy(): void {
    this.socket.emit("leave");
    console.log("Leaving room.");
    this.socket.disconnect();
  }
  
  constructor() {}

  public joinRoom(roomId: string) {
    console.log(`Joining room ${roomId}.`);
    this.socket.emit("join", roomId);
  }

  public emitChange(change: any) {
    if (this.isLocalEvent$.value) {
      console.log(`Emitting change:\n${change}`);
      this.socket.emit("change", change);
    } else {
      // Stop supressing emission of change event
      console.log("Suprressed reemission of change event");
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