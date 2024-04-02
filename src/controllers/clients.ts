import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ClientsEntity } from "../entities/clients";

class ClientsController {
  public async Get(req: Request, res: Response): Promise<void> {
    res.json(
      await AppDataSource.getRepository(ClientsEntity).find({
        order: { id: "ASC" },
        relations: {
          orders: true,
        },
      })
    );
  }

  public async GetId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json(
      await AppDataSource.getRepository(ClientsEntity).find({
        where: { id: +id },
        relations: {
          orders: true,
        },
      })
    );
  }

  public async Post(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      phoneNumber1,
      phoneNumber2,
      location,
      productCount,
      clientNetwork,
    } = req.body;

    const clients = await AppDataSource.getRepository(ClientsEntity)
      .createQueryBuilder()
      .insert()
      .into(ClientsEntity)
      .values({
        firstName,
        lastName,
        phoneNumber1,
        phoneNumber2,
        location,
        productCount,
        clientNetwork,
      })
      .returning("*")
      .execute();

    res.json({
      status: 201,
      message: "clients created",
      data: clients.raw[0],
    });
  }

  public async Put(req: Request, res: Response) {
    try {
      const clients = req.body;
      const { id } = req.params;

      const update = async (id: number, attrs: Partial<ClientsEntity>) => {
        const clients = await AppDataSource.getRepository(ClientsEntity).findOne(
          {
            where: { id: +id },
            relations: {
              orders: true,
            },
          }
        );

        Object.assign(clients, attrs);

        await AppDataSource.manager.save(clients);
        res.json({
          status: 200,
          message: "clients updated",
          data: clients,
        });
      };

      update(+id, clients);
    } catch (error) {
      console.log(error);
    }
  }

  public async Delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const clients = await AppDataSource.getRepository(ClientsEntity)
        .createQueryBuilder()
        .delete()
        .from(ClientsEntity)
        .where({ id })
        .returning("*")
        .execute();

      res.json({
        status: 200,
        message: "clients deleted",
        data: clients.raw[0],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ClientsController();
