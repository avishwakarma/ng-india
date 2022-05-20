import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from "@angular/router";
import { filter, Subscription } from "rxjs";
import { SessionService } from "./shared/session.service";
import { TitleService } from "./shared/title.service";

import { environment } from "../environments/environment";

@Component({
  selector: "ng-india-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  private _authSubscription: Subscription;
  private win: Window | undefined;

  @ViewChild("iframe", { static: true }) iframe: ElementRef | undefined;

  constructor(
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private title: TitleService
  ) {
    this.isLoggedIn = this.session.token ? true : false;

    this._authSubscription = this.session.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;

      this.handleSubdomainLogin();
    });
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

    this.win = this.iframe?.nativeElement.contentWindow;
  }

  private child(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.child(route.firstChild);
    }

    return route;
  }

  private handleSubdomainLogin() {
    if (!this.isLoggedIn) {
      return;
    }

    if (!environment.production) {
      return this.session.redirect();
    }

    if (window.location.hostname === environment.app) {
      const user = this.session.user;
      const element: HTMLIFrameElement | undefined = this.iframe?.nativeElement;
      const href = `http://${user.client.workspace}.${environment.app}`;

      if (element) {
        element.setAttribute("src", `${href}/assets/iframe.html`);

        element.onload = () => {
          element.contentWindow?.postMessage(
            JSON.stringify({
              token: this.session.token,
              refreshToken: this.session.refreshToken,
            }),
            "*"
          );

          this.session.destroy();
          window.location.href = href;
        };
      }
    } else {
      this.session.redirect();
    }
  }
}
