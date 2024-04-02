import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { KargosEntity } from "../entities/kargos";

class KargosController {
  public async Get(req: Request, res: Response): Promise<void> {
    res.json(
      await AppDataSource.getRepository(KargosEntity).find({
        order: { id: "ASC" },
        relations: {
          user: true,
        },
      })
    );
  }

  public async GetId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json(
      await AppDataSource.getRepository(KargosEntity).find({
        where: { id: +id },
        relations: {
          user: true,
        },
      })
    );
  }

  public async Post(req: Request, res: Response) {
    const {
      title,
      simplePrice,
      expensive,
      typeTitleSimple,
      typeTitleExpensive,
      date,
      user,
    } = req.body;

    const kargos = await AppDataSource.getRepository(KargosEntity)
      .createQueryBuilder()
      .insert()
      .into(KargosEntity)
      .values({
        title,
        simplePrice,
        expensive,
        typeTitleSimple,
        typeTitleExpensive,
        date,
        user,
      })
      .returning("*")
      .execute();

    res.json({
      status: 201,
      message: "kargos created",
      data: kargos.raw[0],
    });
  }

  public async Put(req: Request, res: Response) {
    try {
      const kargos = req.body;
      const { id } = req.params;

      const update = async (id: number, attrs: Partial<KargosEntity>) => {
        const kargos = await AppDataSource.getRepository(KargosEntity).findOne({
          where: { id: +id },
          relations: {
            user: true,
          },
        });

        Object.assign(kargos, attrs);

        await AppDataSource.manager.save(kargos);
        res.json({
          status: 200,
          message: "clients updated",
          data: kargos,
        });
      };

      update(+id, kargos);
    } catch (error) {
      console.log(error);
    }
  }

  public async Delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const kargos = await AppDataSource.getRepository(KargosEntity)
        .createQueryBuilder()
        .delete()
        .from(KargosEntity)
        .where({ id })
        .returning("*")
        .execute();

      res.json({
        status: 200,
        message: "kargos deleted",
        data: kargos.raw[0],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new KargosController();
