import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WORKSPACE_REGEX } from "@ng-india/constant";
import { environment } from "../../../environments/environment";
import { restrictWorkspaceValue } from "../../app.utils";
import { SessionService } from "../../shared/session.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "ng-india-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    workspace: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(WORKSPACE_REGEX),
        restrictWorkspaceValue(["api", "auth"]),
      ],
      asyncValidators: [this.auth.uniqueWorkspaceValidation()],
      updateOn: "blur",
    }),
    company: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
  });

  constructor(private auth: AuthService, private session: SessionService) {}

  ngOnInit(): void {
    if (this.session.token) {
      return this.session.redirect();
    }

    const workspace = window.location.hostname.replace(environment.app, "");

    if (workspace) {
      this.session.redirect(["/auth/login"]);
    }
  }

  get workspace() {
    return this.registerForm.get("workspace");
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }

    this.auth
      .register(this.registerForm.getRawValue())
      .subscribe((res: any) => {
        if (res.token) {
          this.session.init(res);
        }
      });
  }
}
