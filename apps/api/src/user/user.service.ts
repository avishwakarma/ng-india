import { Injectable } from "@nestjs/common";
import { InjectTenancyModel } from "nestjs-tenancy";

import { User } from "@ng-india/models";

@Injectable()
export class UserService {
  constructor(@InjectTenancyModel(User.name) private user: typeof User) {}

  async findByPk(id: string) {
    return this.user.findByPk(id);
  }
}
