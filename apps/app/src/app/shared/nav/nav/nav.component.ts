import { Component, OnInit } from "@angular/core";
import { SessionService } from "../../session.service";

@Component({
  selector: "ng-india-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  user: any = null;
  constructor(private session: SessionService) {}

  logout() {
    this.session.destroy();
  }

  get firstLetter() {
    if (this.user) {
      return `${this.user.firstName[0]}${this.user.lastName[0]}`;
    }

    return "B";
  }

  ngOnInit(): void {
    this.user = this.session.user;
  }
}
