import { Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from "@angular/router";
import { filter, Subscription } from "rxjs";
import { SessionService } from "./shared/session.service";
import { StorageService } from "./shared/storage.service";
import { TitleService } from "./shared/title.service";

@Component({
  selector: "ng-india-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  private _authSubscription: Subscription;

  constructor(
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private title: TitleService,
    private storage: StorageService
  ) {
    this.isLoggedIn = this.session.token ? true : false;

    this._authSubscription = this.session.subscribe(
      (isLoggedIn: boolean) => (this.isLoggedIn = isLoggedIn)
    );
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is RouterEvent => e instanceof NavigationEnd))
      .subscribe(() => {
        const { routeConfig }: ActivatedRoute = this.child(this.route);

        if (routeConfig && routeConfig.data && routeConfig.data["title"]) {
          this.title.set(routeConfig.data["title"]);
        }
      });
  }

  private child(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.child(route.firstChild);
    }

    return route;
  }
}
