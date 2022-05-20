import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  Is,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  AllowNull,
} from "sequelize-typescript";

import { WORKSPACE_REGEX } from "@ng-india/constant";

@Table({ tableName: "clients" })
export class Client extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Is(WORKSPACE_REGEX)
  @Unique
  @Column(DataType.STRING)
  workspace: string;

  @Column(DataType.STRING)
  company: string;

  @AllowNull
  @Column(DataType.STRING)
  website: string;

  @Column(DataType.STRING)
  dbHost: string;

  @Column(DataType.INTEGER)
  dbPort: number;

  @Column(DataType.STRING)
  dbUser: string;

  @Column(DataType.STRING)
  dbPassword: string;

  @Column(DataType.STRING)
  dbName: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  status: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
