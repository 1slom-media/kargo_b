import "reflect-metadata";
import { DataSource } from "typeorm";
import { UsersEntity } from "./entities/users";
import { KargosEntity } from "./entities/kargos";
import { ClientsEntity } from "./entities/clients";
import { OrdersEntity } from "./entities/orders";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "islom_01",
  database: "kargo_b",
  synchronize: true,
  logging: false,
  entities: [UsersEntity, KargosEntity, ClientsEntity, OrdersEntity],
  migrations: [],
  subscribers: [],
});
