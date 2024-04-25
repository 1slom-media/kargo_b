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
            clients: true,
            orders: true,
          },
          where: { id: +id },
        });
        return users;
      } else {
        const users = await AppDataSource.getRepository(UsersEntity).find({
          relations: {
            kargos: true,
            clients: true,
            orders: true,
          },
        });
        return users;
      }
    },
    kargos: async (_, { id, userId }) => {
      if (id && +id > 0) {
        const kargos = await AppDataSource.getRepository(KargosEntity).find({
          relations: {
            user: true,
          },
          where: { id: +id },
        });
        return kargos;
      }
      if (userId && +userId > 0) {
        const kargos = await AppDataSource.getRepository(KargosEntity).find({
          relations: {
            user: true,
          },
        });
        const userById = kargos.filter((order) => order?.user?.id == userId);
        return userById;
      } else {
        const kargos = await AppDataSource.getRepository(KargosEntity).find({
          relations: {
            user: true,
          },
        });
        return kargos;
      }
    },
    clients: async (_, { id, userId }) => {
      if (id && +id > 0) {
        const clients = await AppDataSource.getRepository(ClientsEntity).find({
          relations: {
            orders: true,
            user: true,
          },
          where: { id: +id },
        });
        return clients;
      }
      if (userId && +userId > 0) {
        const clients = await AppDataSource.getRepository(ClientsEntity).find({
          relations: {
            orders: true,
            user: true,
          },
        });
        const userById = clients.filter((order) => order?.user?.id == userId);
        return userById;
      } else {
        const clients = await AppDataSource.getRepository(ClientsEntity).find({
          relations: {
            orders: true,
            user: true,
          },
        });
        return clients;
      }
    },
    orders: async (_, { id, userId, skip, take }) => {
      if (id && +id > 0) {
        const orders = await AppDataSource.getRepository(OrdersEntity).find({
          relations: {
            clients: true,
            user: true,
          },
          where: { id: +id },
        });
        return [
          {
            pages: 1,
            orders,
          },
        ];
      }
      if (userId && +userId > 0) {
        const orders = await AppDataSource.getRepository(OrdersEntity).find({
          relations: {
            clients: true,
            user: true,
          }
        });
        const userById = orders.filter((order) => order?.user?.id == userId);
        return [
          {
            pages: 1,
            orders:userById,
          },
        ];
      }
      if (+skip > 0 && +take > 0) {
        const orders = await AppDataSource.getRepository(OrdersEntity).find({
          relations: {
            clients: true,
            user: true,
          },
        });
        const paginatedOrders = await AppDataSource.getRepository(
          OrdersEntity
        ).find({
          relations: {
            clients: true,
            user: true,
          },
          skip: +take * (+skip - 1),
          take: +take,
        });
        return [
          {
            pages: Math.ceil(+orders.length / +take),
            orders: paginatedOrders,
          },
        ];
      }
      if(+skip>0 && +take>0 && +userId>0){
        const orders = await AppDataSource.getRepository(OrdersEntity).find({
          relations: {
            clients: true,
            user: true,
          },
        });
        const userById = orders.filter((order) => order?.user?.id == userId);
        return [{
          pages:Math.ceil(+userById.length/+take),
          orders:userById.slice((+skip-1)*+take,+skip*+take)
        }]
      }
      const orders = await AppDataSource.getRepository(OrdersEntity).find({
        relations: {
          clients: true,
          user: true,
        },
      });
      return [
        {
          pages: 1,
          orders,
        },
      ];
    },
  },
};
