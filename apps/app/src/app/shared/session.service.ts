import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { userFromToken } from "../app.utils";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private _token = "";
  private _refreshToken = "";
  private _user: any = null;
  private _subject: BehaviorSubject<boolean> = new BehaviorSubject(
    false as boolean
  );

  constructor(private storage: StorageService, private router: Router) {}

  private _check() {
    const _token: string = this.storage.get("_token");

    if (!_token) {
      this._subject.next(false);
      return false;
    }

    this._token = _token;
    this._user = this.storage.get("_user");

    if (!this._user) {
      this._user = userFromToken(this._token);
      this.storage.set("_user", this._user);
    }

    this._subject.next(true);
    return true;
  }

  get setup(): boolean {
    return !this.user.birthday || !this.user.workplace;
  }

  get token() {
    if (!this._token) {
      this._check();
    }

    return this._token;
  }

  set token(token: string) {
    this.storage.set("_token", token);
    this._token = token;
    this._user = userFromToken(this._token);
    this.storage.set("_user", this._user);
  }

  get user() {
    if (!this._user) {
      this._check();
    }

    return this._user;
  }

  get refreshToken() {
    if (!this._refreshToken) {
      this._refreshToken = this.storage.get("_refreshToken");
    }

    return this._refreshToken;
  }

  set refreshToken(token: string) {
    this.storage.set("__refreshToken", token);
    this._refreshToken = token;
  }

  init({ token, refreshToken }: any) {
    this.storage.set("_token", token);
    this.storage.set("_refreshToken", refreshToken);
    this.storage.set("_user", userFromToken(token));
    this._token = this.storage.get("_token");
    this._user = this.storage.get("_user");
    this._refreshToken = this.storage.get("_refreshToken");
    this._subject.next(true);
  }

  redirect(path: Array<string> = ["/"]) {
    this.router.navigate(path);
  }

  destroy() {
    this.storage.destroy();
    this._user = null;
    this._token = "";
    this._subject.next(false);
    this.router.navigate(["/auth"]);
  }

  logout() {
    this.destroy();
    this.router.navigate(["/auth/login"]);
  }

  subscribe(callback: (value: boolean) => void) {
    return this._subject.subscribe((value: boolean) => {
      callback(value);
    });
  }
}
