import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { LandlordService } from "@ng-india/landlord";
import { Client, User } from "@ng-india/models";
import { checkHash } from "@ng-india/utils";
import { RegisterInput } from "@ng-india/types";

@Injectable()
export class AuthService {
  constructor(
    private landlord: LandlordService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  private tokens(
    user: Partial<User>,
    client: Partial<Client>,
    ua: string,
    ip: string
  ) {
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      avatar: user.avatar,
      role: user.role,
      client: {
        id: client.id,
        status: client.status,
        workspace: client.workspace,
        company: client.company,
        website: client.website,
        createdAt: client.createdAt,
      },
    };

    const payload = {
      user: userData,
      ua,
      ip,
    };

    const token: string = this.jwt.sign(payload);
    const refreshToken: string = this.jwt.sign(payload, {
      expiresIn: this.config.get("jwtRefreshExpiry"),
    });

    return {
      token,
      refreshToken,
    };
  }

  async register(data: RegisterInput, { ua, ip }) {
    const { user, client } = await this.landlord.register(data);

    return {
      user,
      client,
      ...this.tokens(user, client, ua, ip),
    };
  }

  async loginViaToken(token: string) {
    if (!token) {
      throw new HttpException("Bad request.", 400);
    }

    const payload = this.jwt.verify(token);

    if (!payload) {
      throw new HttpException("Unauthorized.", 403);
    }

    return this.tokens(
      payload.user,
      payload.user.client,
      payload.ua,
      payload.ip
    );
  }

  async refreshToken(user, { ua, ip }) {
    return this.tokens(user, user.client, ua, ip);
  }

  async checkWorkspace(workspace: string) {
    return this.landlord.checkWorkspace(workspace);
  }

  async login({ email, password, workspace }, { ua, ip }) {
    const { user, client } = await this.landlord.getUser(workspace, email);

    if (!user) {
      throw new HttpException("Invalid email.", 400);
    }

    if (!user.status) {
      throw new HttpException("Account disabled.", 403);
    }

    const isValid: boolean = await checkHash(password, user.password);

    if (!isValid) {
      throw new HttpException("Invalid credentials", 401);
    }

    return this.tokens(user, client, ua, ip);
  }
}
