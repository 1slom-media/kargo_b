import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { OrdersEntity } from "../entities/orders";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { ClientsEntity } from "../entities/clients";
dotenv.config();

class OrdersController {
  public async Get(req: Request, res: Response): Promise<void> {
    res.json(
      await AppDataSource.getRepository(OrdersEntity).find({
        order: { id: "ASC" },
        relations: {
          clients: true,
        },
      })
    );
  }

  public async GetId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json(
      await AppDataSource.getRepository(OrdersEntity).find({
        where: { id: +id },
        relations: {
          clients: true,
        },
      })
    );
  }

  public async Post(req: Request, res: Response) {
    const {
      title,
      price_region,
      count,
      weight,
      type,
      logistica,
      priceAll,
      logisticaPrice,
      logisticaPriceAll,
      productPrice,
      productPriceAll,
      status,
      priceTitle,
      user,
      link
    } = req.body;

    const { filename } = req.file;
    const image = process.env.IMAGE_PATH + "/static/" + filename;

    const orders = await AppDataSource.getRepository(OrdersEntity)
      .createQueryBuilder()
      .insert()
      .into(OrdersEntity)
      .values({
        title,
        price_region,
        count,
        weight,
        type,
        logistica,
        priceAll,
        logisticaPrice,
        logisticaPriceAll,
        productPrice,
        productPriceAll,
        status,
        priceTitle,
        image,
        user,
        link
      })
      .returning("*")
      .execute();

    res.json({
      status: 201,
      message: "orders created",
      data: orders.raw[0],
    });
  }

  public async Put(req: Request, res: Response) {
    try {
      const {
        title,
        price_region,
        count,
        weight,
        type,
        logistica,
        priceAll,
        logisticaPrice,
        logisticaPriceAll,
        productPrice,
        productPriceAll,
        status,
        priceTitle,
        clientId,
        user,
        link
      } = req.body;
      const { id } = req.params;
      let image: string;
      if (req.file) {
        const { filename } = req.file;
        image = process.env.IMAGE_PATH + "/static/" + filename;
      }

      // old image delete
      const orders = await AppDataSource.getRepository(OrdersEntity).findOne({
        where: { id: +id },
        relations: { clients: true },
      });
      if (orders && image != undefined) {
        const filePath = orders?.image;
        const imageToDelete = filePath.replace(
          process.env.IMAGE_PATH + "/static/",
          ""
        );
        const imagePath = path.join(process.cwd(), "uploads", imageToDelete);
        fs.unlinkSync(imagePath);
      } else {
        console.log("xato");
      }

      orders.title = title != "" ? title : orders.title;
      orders.link = link != "" ? link : orders.link;
      orders.price_region =
        price_region != "" ? price_region : orders.price_region;
      orders.count = count != "" ? count : orders.count;
      orders.weight = weight != "" ? weight : orders.weight;
      orders.type = type != "" ? type : orders.type;
      orders.logistica = logistica != "" ? logistica : orders.logistica;
      orders.priceAll = priceAll != "" ? priceAll : orders.priceAll;
      orders.logisticaPrice =
        logisticaPrice != "" ? logisticaPrice : orders.logisticaPrice;
      orders.logisticaPriceAll =
        logisticaPriceAll != "" ? logisticaPriceAll : orders.logisticaPriceAll;
      orders.productPrice =
        productPrice != "" ? productPrice : orders.productPrice;
      orders.productPriceAll =
        productPriceAll != "" ? productPriceAll : orders.productPriceAll;
      orders.status = status != "" ? status : orders.status;
      orders.priceTitle = priceTitle != "" ? priceTitle : orders.priceTitle;
      orders.image = image != undefined ? image : orders.image;
      orders.user = user != "" ? user : orders?.user?.id;
      if (clientId && +clientId>0) {
        const client = await AppDataSource.getRepository(ClientsEntity).findOne(
          {
            where: { id: +clientId },
          }
        );
        if (!orders.clients) {
          orders.clients = [];
        }
        orders.clients.push(client);
      }

      await AppDataSource.manager.save(orders);

      res.json({
        status: 200,
        message: "orders updated",
        data: orders,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async Delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orders = await AppDataSource.getRepository(OrdersEntity)
        .createQueryBuilder()
        .delete()
        .from(OrdersEntity)
        .where({ id })
        .returning("*")
        .execute();

      res.json({
        status: 200,
        message: "orders deleted",
        data: orders.raw[0],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new OrdersController();
