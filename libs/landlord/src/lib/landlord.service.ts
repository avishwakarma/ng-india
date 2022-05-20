import {
  CACHE_MANAGER,
  Global,
  HttpException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { Sequelize } from "sequelize-typescript";
import { toHash } from "@ng-india/utils";
import { DatabaseConfig, RegisterInput, ConnectionMap } from "@ng-india/types";

import { InjectModel } from "@nestjs/sequelize";
import { User, Client } from "@ng-india/models";

import { TenantModels } from "./tenant.models";

@Global()
@Injectable()
export class LandlordService {
  private _clientConnection: ConnectionMap = new Map<string, Sequelize>();

  constructor(
    private config: ConfigService,
    @InjectModel(Client) private client: typeof Client,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}

  async checkWorkspace(workspace: string) {
    const exists = await this.client.findOne({
      where: { workspace },
    });

    if (exists) {
      return { status: true, message: "Workspace already exists." };
    }

    return { status: false, message: "Workspace does not exists." };
  }

  async getUser(workspace: string, email: string) {
    const client: Client = await this.getClient(workspace);

    if (!client) {
      throw new HttpException("Invalid workspace.", 400);
    }

    const conn: Sequelize = this.getConnection(
      {
        id: client.id,
        host: client.dbHost,
        port: client.dbPort,
        username: client.dbUser,
        password: client.dbPassword,
        database: client.dbName,
      },
      workspace
    );

    const user: User = await conn.getRepository(User).findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        user: null,
        client,
      };
    }

    return {
      user,
      client,
    };
  }

  async register(clientData: RegisterInput) {
    const exists: Client = await this.client.findOne({
      where: { workspace: clientData.workspace },
    });

    if (exists) {
      throw new HttpException("Client with workspace already exists.", 400);
    }

    return this.addTenant(clientData);
  }

  async findClient(option): Promise<Client> {
    return this.client.findOne(option);
  }

  async getClient(workspace: string): Promise<Client> {
    const clientJSON = await this.cache.get<string>(workspace);

    if (clientJSON) {
      return JSON.parse(clientJSON) as Client;
    }

    const client: Client = await this.client.findOne({
      where: { workspace },
    });

    if (!client) {
      return null;
    }

    await this.cache.set<string>(workspace, JSON.stringify(client.toJSON()));

    return client;
  }

  async addTenant({ workspace, company, ...userData }: RegisterInput) {
    const exists: Client = await this.client.findOne({
      where: { workspace },
    });

    if (exists) {
      throw new HttpException("Client already exists", 400);
    }

    const connection = await this.createTenantDatabase({
      host: this.config.get("tenantDbHost"),
      port: this.config.get("tenantDbPort"),
      username: this.config.get("tenantDbUser"),
      password: this.config.get("tenantDbPassword"),
      database: workspace,
    });

    if (!connection) {
      throw new HttpException("Something went worng.", 500);
    }

    await connection.sync({ force: true });

    const client = await this.client.create({
      workspace,
      company,
      dbHost: this.config.get("tenantDbHost"),
      dbPort: this.config.get("tenantDbPort"),
      dbUser: this.config.get("tenantDbUser"),
      dbPassword: this.config.get("tenantDbPassword"),
      dbName: `${workspace}`,
    });

    await this.cache.set<string>(workspace, JSON.stringify(client.toJSON()));

    const user = await this.createAdminUser(connection, client.id, userData);

    return { client, user };
  }

  private async createTenantDatabase(opt: DatabaseConfig) {
    try {
      const base: Sequelize = new Sequelize({
        host: opt.host,
        port: opt.port,
        username: opt.username,
        password: opt.password,
        dialect: "postgres",
        database: "postgres",
      });

      await base.query(`CREATE DATABASE ${opt.database}`);

      return this.getConnection(opt, opt.database);
    } catch (error) {
      return null;
    }
  }

  private async createAdminUser(
    connection: Sequelize,
    clientId: string,
    user: Partial<User>
  ) {
    const password = await toHash(user.password);

    return connection.getRepository(User).create({
      ...user,
      password,
      clientId,
      role: "admin",
      status: true,
    });
  }

  async getClientConnection(workspace: string): Promise<Sequelize> {
    if (this._clientConnection.has(workspace)) {
      return this._clientConnection.get(workspace);
    }

    const client: Client = await this.getClient(workspace);

    return this.getConnection(
      {
        id: client.id,
        host: client.dbHost,
        port: client.dbPort,
        username: client.dbUser,
        password: client.dbPassword,
        database: client.dbName,
      },
      workspace
    );
  }

  private getConnection(opt: DatabaseConfig, workspace: string): Sequelize {
    if (this._clientConnection.has(workspace)) {
      return this._clientConnection.get(workspace);
    }

    const connection: Sequelize = new Sequelize({
      dialect: "postgres",
      host: opt.host,
      port: opt.port,
      username: opt.username,
      password: opt.password,
      database: opt.database,
      models: TenantModels,
    });

    this._clientConnection.set(workspace, connection);

    return connection;
  }
}
