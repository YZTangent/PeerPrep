import { Component } from '@angular/core';
import { MatchingService } from '../_services/matching.service';
import { NgForm } from '@angular/forms';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css']
})
export class MatchingComponent {

  match: any = undefined

  requested: boolean = false

  queueLength: number = -1

  constructor(private matchingService: MatchingService, private storageService: StorageService){}

  ngOnInit() {
    this.getQueueLength();
  }

  getMatch(userDetails: Object) {
    this.matchingService.enqueue(userDetails).subscribe((res) => {
      console.log(res)
      if (res.message.includes("Matched users:")) {
        this.match = res.message;
        this.getQueueLength()
      }
    })
    this.getQueueLength()
  }

  getQueueLength() {
    this.matchingService.getQueueLength().subscribe((res) => {
      this.queueLength = res.length
    })
  }

  submitMatchingForm(form: NgForm) {
    let obj = Object.assign({}, form.value)
    obj["userid"] = this.storageService.getUser()["id"]
    this.getMatch(obj)
    this.requested = true;
  }

}
