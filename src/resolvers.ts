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
    orders: async (_, { id, userId, skip, take, search, status }) => {
      let query = AppDataSource.getRepository(OrdersEntity)
        .createQueryBuilder("ordes")
        .leftJoinAndSelect("ordes.clients", "clients")
        .leftJoinAndSelect("ordes.user", "users")
        .orderBy("ordes.id", "DESC");

      if (id && +id > 0) {
        query = query.andWhere("ordes.id = :id", {
          id: id,
        });
      }
      if (status && String(status).length) {
        query = query.andWhere("ordes.status=:status", { status: status });
      }
      if (search && String(search).length) {
        query = query.andWhere("ordes.title LIKE :search", {
          search: `${search}%`,
        });
      }

      if (userId && userId > 0 && +skip > 0 && +take > 0) {
        const ordersList = await query.getMany();
        const userById = ordersList.filter(
          (order) => order?.user?.id == userId
        );
        return [
          {
            pages: Math.ceil(+userById.length / +take),
            orders: userById.slice((+skip - 1) * +take, +skip * +take),
          },
        ];
      }
      if (userId && userId > 0) {
        const ordersList = await query.getMany();
        const userById = ordersList.filter(
          (order) => order?.user?.id == userId
        );
        return [
          {
            pages: 1,
            orders: userById,
          },
        ];
      }
      if (+skip > 0 && +take > 0 && !userId) {
        query = query.skip(+take * (+skip - 1)).take(+take);
        const ordersList = await query.getMany();
        return [
          {
            pages: Math.ceil(+ordersList.length / +take),
            orders: ordersList,
          },
        ];
      }
      const ordersList = await query.getMany();
      return [
        {
          pages: 1,
          orders: ordersList,
        },
      ];
    },
  },
};
