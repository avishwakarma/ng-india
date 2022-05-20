import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ToastService } from "../toast.service";

@Component({
  selector: "ng-india-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
})
export class ToastComponent implements OnDestroy {
  shown = false;
  title = "";
  message = "";
  type = "success";

  private subscription: Subscription;

  constructor(private toast: ToastService) {
    this.subscription = this.toast.subscribe((data: any) => {
      if (data) {
        this.shown = data.shown;
        this.title = data.title;
        this.type = data.type;
        this.message = data.message;
      } else {
        this.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private reset() {
    this.shown = false;
  }
}
