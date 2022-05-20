import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _storage: any = {
    sessionStorage: window.sessionStorage,
    localStorage: window.localStorage,
  };

  set(key: string, value: any, type: string = "sessionStorage") {
    if (typeof value !== "string") {
      value = JSON.stringify(value);
    }

    this._storage[type].setItem(key, value);
  }

  get(key: string, type: string = "sessionStorage") {
    const value = this._storage[type].getItem(key);

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  remove(key: string, type: string = "sessionStorage") {
    this._storage[type].removeItem(key);
  }

  destroy(type: string = "sessionStorage") {
    this._storage[type].clear();
  }
}
