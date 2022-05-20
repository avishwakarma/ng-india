import { Component, OnInit } from "@angular/core";
import { HomeService } from "../home.service";

@Component({
  selector: "ng-india-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  me: any = {};

  constructor(private home: HomeService) {}

  ngOnInit(): void {
    this.home.me().subscribe((res: any) => {
      this.me = res;
    });
  }
}
