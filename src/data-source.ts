import "reflect-metadata";
import { DataSource } from "typeorm";
import { UsersEntity } from "./entities/users";
import { KargosEntity } from "./entities/kargos";
import { ClientsEntity } from "./entities/clients";
import { OrdersEntity } from "./entities/orders";
import dotenv from 'dotenv';
dotenv.config()

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.PG_PASSWORD,
  database: "kargo_b",
  synchronize: true,
  logging: false,
  entities: [UsersEntity, KargosEntity, ClientsEntity, OrdersEntity],
  migrations: [],
  subscribers: [],
});
