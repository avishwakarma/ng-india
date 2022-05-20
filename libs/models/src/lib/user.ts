import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  IsEmail,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  AllowNull,
} from "sequelize-typescript";

import { Gender } from "@ng-india/types";

@Table({ tableName: "users" })
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column(DataType.UUID)
  clientId: string;

  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  role: string;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  password: string;

  @AllowNull
  @Column({
    type: DataType.ENUM({
      values: Object.keys(Gender),
    }),
  })
  gender: Gender;

  @AllowNull
  @Column(DataType.STRING)
  avatar: string;

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
