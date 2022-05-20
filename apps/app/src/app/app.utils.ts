import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const parseToken = (token: string) => {
  return JSON.parse(atob(token.split(".")[1]).toString());
};

export const userFromToken = (token: string) => {
  const payload: any = parseToken(token);
  return payload.user;
};

export const isExpired = (token: string): boolean => {
  const { expiry }: any = parseToken(token);
  return Date.now() > expiry * 1000;
};

export function restrictWorkspaceValue(values: Array<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return values.includes(control.value)
      ? { restrcitedWorkspac: { value: control.value } }
      : null;
  };
}
