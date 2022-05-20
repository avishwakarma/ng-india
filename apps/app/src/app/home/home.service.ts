import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private base = `${environment.api}`;

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get(`${this.base}/users/me`);
  }
}
