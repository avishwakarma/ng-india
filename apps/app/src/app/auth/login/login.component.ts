import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WORKSPACE_REGEX } from "@ng-india/constant";
import { environment } from "../../../environments/environment";
import { SessionService } from "../../shared/session.service";
import { ToastService } from "../../shared/toast/toast.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "ng-india-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hasWorkspace = false;
  loginForm: FormGroup = new FormGroup({
    workspace: new FormControl("", [
      Validators.required,
      Validators.pattern(WORKSPACE_REGEX),
    ]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    if (this.session.token) {
      return this.session.redirect();
    }

    const workspace = window.location.hostname.replace(environment.app, "");

    if (workspace) {
      this.hasWorkspace = true;
      this.loginForm.get("workspace")?.setValue(workspace.replace(".", ""));
    }
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }

    this.auth.login(this.loginForm.getRawValue()).subscribe(
      (res: any) => {
        if (res.token) {
          this.session.init(res);
        }
      },
      ({ error }: any) => {
        console.log(error);
        this.toast.error("An Error occured", error.message);
      }
    );
  }
}
