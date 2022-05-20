import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { LoginInput, RegisterInput } from "@ng-india/types";
import { distinctUntilChanged, first, map, Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private base = `${environment.auth}`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginInput) {
    return this.http.post(`${this.base}/login`, credentials);
  }

  register(data: RegisterInput) {
    return this.http.post(`${this.base}/register`, data);
  }

  checkWorkspace(workspace: string) {
    return this.http.get(`${this.base}/check-workspace/${workspace}`);
  }

  loginViaToken(token: string) {
    return this.http.post(`${this.base}/login-via-token`, {
      token,
    });
  }

  uniqueWorkspaceValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkWorkspace(control.value).pipe(
        distinctUntilChanged(),
        map((res: any) => (res.isExists ? { workspaceExists: true } : null)),
        first()
      );
    };
  }
}
