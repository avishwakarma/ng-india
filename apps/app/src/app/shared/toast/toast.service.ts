import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private timer: any;

  constructor(private zone: NgZone) {}

  hide() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.subject.next(null);
  }

  success(title: string, message: string) {
    this.subject.next({
      shown: true,
      type: "success",
      title,
      message,
    });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.zone.run(() => this.hide());
    }, 3000);
  }

  error(title: string, message: string) {
    this.subject.next({
      shown: true,
      type: "error",
      title,
      message,
    });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.zone.run(() => this.hide());
    }, 3000);
  }

  subscribe(cb: (data: any) => void) {
    return this.subject.subscribe((shown: any) => cb(shown));
  }
}
