import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { MatchingService } from '../_services/matching.service'
import { StorageService } from '../_services/storage.service'
import { timeoutWith, throwError, count, interval } from 'rxjs'

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css']
})
export class MatchingComponent {

  match: any = undefined

  requested: boolean = false

  queueLength: number = -1

  currUser = this.storageService.getUser().username

  timer = {s: 0, mn: 0};

  countDown: any = undefined

  constructor(
    private router: Router,
    private matchingService: MatchingService,
    private storageService: StorageService){}

  ngOnInit() {
    this.getQueueLength()
  }

  stopTimer() {
    this.timer.s = 0;
    this.timer.mn += 1;
    clearInterval(this.countDown)
    this.countDown = undefined
  }

  getMatch(userDetails: any) {
    // this.countDown = setInterval(() => {
    //   this.timer.s += 1;
    //   document.getElementById("bar")!.style.width = (this.timer.s/30)*100+"%";
    //   document.getElementById("bar")!.innerHTML = this.timer.s + "s";
    //   if (this.timer.s > 30) {
    //     this.stopTimer()
    //   }
    // }, 1000);

    this.matchingService.enqueue(userDetails).pipe(timeoutWith(30000, throwError(() => {
      this.matchingService.dequeue(userDetails["userid"]).subscribe((res) => {
        this.match = "Your request timed out!"
        setTimeout(() => this.requested = false, 5000);
        this.stopTimer()
        this.getQueueLength()
      })
    }))).subscribe((res) => {
      console.log(res);
      if (res.message.includes("Matched users:")) {
        this.match = res.message
        this.getQueueLength()
        this.matchingService.updateMatchId(res.match);
        this.stopTimer()
        this.router.navigate(["/collab", res.roomId, res.difficulty, res.language]);
      }
    }, (err) => {
      this.match = "We encountered a problem. Please try again later."
      this.getQueueLength()
      this.stopTimer()
      setTimeout(() => this.requested = false, 15000);
    })
    this.getQueueLength()
  }

  cancelMatch() {
    let userid = this.storageService.getUser()["id"]
    this.matchingService.dequeue(userid).subscribe((res) => {
      this.getQueueLength()
      this.stopTimer()
      this.requested = false
      this.match = undefined
    })
  }

  getQueueLength() {
    this.matchingService.getQueueLength().subscribe((res) => {
      this.queueLength = res.length
    })
  }

  submitMatchingForm(form: NgForm) {
    let obj = Object.assign({}, form.value)
    obj["userid"] = this.storageService.getUser()["username"]
    this.getMatch(obj)
    this.requested = true
    if (this.match == "You're request timed out!") {
      this.match = "We're trying to match you..."
    }
  }

  goToSolo(userDetails: any) {
    this.stopTimer()
    var details = userDetails.value;
    this.router.navigate(["/collab", this.currUser, details.difficulty, details.language])
  }

}
