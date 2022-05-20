import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class TitleService {
  private _base = " — Multi Tenant Application.";

  constructor(private title: Title) {}

  set(title: string) {
    this.title.setTitle(`${title} ${this._base}`);
  }

  get(): string {
    return this.title.getTitle();
  }
}
