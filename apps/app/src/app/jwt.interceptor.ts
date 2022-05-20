import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  Observable,
  throwError,
  catchError,
  BehaviorSubject,
  switchMap,
  filter,
  take,
} from "rxjs";

import { SessionService } from "./shared/session.service";
import { isExpired } from "./app.utils";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private refreshing = false;
  private _subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private session: SessionService, private auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let req: HttpRequest<any> = request;
    const token: string | null =
      this.session.token && !isExpired(this.session.token)
        ? this.session.token
        : null;

    if (token) {
      req = this.addToken(request, token, this.session.user.client.workspace);
    }

    return next.handle(req).pipe(
      catchError((error: any) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes("login") &&
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.refreshing) {
      this.refreshing = true;
      this._subject.next(null);

      const token: string | null =
        this.session.refreshToken && !isExpired(this.session.refreshToken)
          ? this.session.refreshToken
          : null;

      if (token) {
        return this.auth.loginViaToken(token).pipe(
          switchMap((res: any) => {
            this.refreshing = false;
            this.session.token = res.token;
            this.session.refreshToken = res.refreshToken;
            this._subject.next(this.session.token);

            return next.handle(
              this.addToken(
                req,
                this.session.token,
                this.session.user.client.workspace
              )
            );
          }),
          catchError((error: any) => {
            this.refreshing = false;
            this.session.logout();
            return throwError(error);
          })
        );
      }
    }

    return this._subject.pipe(
      filter((token: string) => token !== null),
      take(1),
      switchMap((token: string) =>
        next.handle(
          this.addToken(req, token, this.session.user.client.workspace)
        )
      )
    );
  }

  private addToken(
    request: HttpRequest<any>,
    token: string,
    workspace: string
  ) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        workspace: workspace,
      },
    });
  }
}
