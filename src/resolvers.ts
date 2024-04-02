import { AppDataSource } from "./data-source";
import { ClientsEntity } from "./entities/clients";
import { KargosEntity } from "./entities/kargos";
import { OrdersEntity } from "./entities/orders";
import { UsersEntity } from "./entities/users";

export const resolvers = {
  Query: {
    users: async (_, { id }) => {
      if (id && +id > 0) {
        const users = await AppDataSource.getRepository(UsersEntity).find({
          relations: {
            kargos: true,
          },
          where: { id: +id },
        });
        return users;
      } else {
        const users = await AppDataSource.getRepository(UsersEntity).find({
          relations: {
            kargos: true,
          },
        });
        return users;
      }
    },
    kargos: async (_, { id }) => {
      if (id && +id > 0) {
        const kargos = await AppDataSource.getRepository(KargosEntity).find({
          relations: {
            user: true,
          },
          where: { id: +id },
        });
        return kargos;
      } else {
        const kargos = await AppDataSource.getRepository(KargosEntity).find({
          relations: {
            user: true,
          },
        });
        return kargos;
      }
    },
    clients: async (_, { id }) => {
      if (id && +id > 0) {
        const clients = await AppDataSource.getRepository(ClientsEntity).find({
          relations: {
            orders: true,
          },
          where: { id: +id },
        });
        return clients;
      } else {
        const clients = await AppDataSource.getRepository(ClientsEntity).find({
          relations: {
            orders: true,
          },
        });
        return clients;
      }
    },
    orders: async (_, { id }) => {
      if (id && +id > 0) {
        const orders = await AppDataSource.getRepository(OrdersEntity).find({
          relations: {
            clients: true,
          },
          where: { id: +id },
        });
        return orders;
      } else {
        const orders = await AppDataSource.getRepository(OrdersEntity).find({
          relations: {
            clients: true,
          }, 
        });
        return orders;
      }
    },
  },
};
