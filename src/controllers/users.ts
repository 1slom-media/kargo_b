import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import path from "path";
import fs from "fs";
import { UsersEntity } from "../entities/users";
import dotenv from "dotenv";
import { compare } from "../utils/compare";
import { sign } from "../utils/jwt";
import { hashed } from "../utils/hashed";
dotenv.config();

class CategoryController {
  public async Get(req: Request, res: Response): Promise<void> {
    res.json(await AppDataSource.getRepository(UsersEntity).find());
  }

  public async GetId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    res.json(
      await AppDataSource.getRepository(UsersEntity).find({
        where: { id: +id },
      })
    );
  }

  public async WhoAmi(req: Request, res: Response): Promise<void> {
    const userId = req.userId;
    const user = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { id: +userId },
    });
    if (user && user.trial === true) {
      res.json(
        await AppDataSource.getRepository(UsersEntity).find({
          where: { id: +userId },
        })
      );
    } else {
      req.userId = null;
      res.json({
        data: null,
      });
    }
  }

  public async Login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;

      const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { phone },
      });
      if (
        foundUser &&
        (await compare(password, foundUser.password)) == true &&
        foundUser.trial == true
      ) {
        res.json({
          status: 201,
          message: "login success",
          token: sign({ userId: foundUser.id }),
          data: foundUser,
        });
      }
      if (
        foundUser &&
        (await compare(password, foundUser.password)) == true &&
        foundUser.trial == false
      ) {
        res.json({
          status: 201,
          message: "your subscription has expired",
          token: null,
          data: [],
        });
      } else {
        res.json({
          status: 404,
          message: "email or password invalid",
          token: null,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async Post(req: Request, res: Response) {
    try {
      let { username, phone, password, role, time_date } = req.body;
      const { filename } = req.file;
      const avatar = process.env.IMAGE_PATH + "/static/" + filename;
      password = await hashed(password);
      time_date = new Date(time_date);
      const uniqueUser = await AppDataSource.getRepository(UsersEntity).findOne(
        {
          where: { phone },
        }
      );

      if (!uniqueUser) {
        const users = await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .insert()
          .into(UsersEntity)
          .values({ username, avatar, phone, password, role, time_date })
          .returning("*")
          .execute();

        res.json({
          status: 201,
          message: "users created",
          data: users.raw[0],
        });
      } else {
        res.json({
          status: 400,
          message: "users already exists",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async Put(req: Request, res: Response) {
    try {
      const { username, phone, password, role, time_date, trial } = req.body;
      const { id } = req.params;
      let avatar: string;
      if (req.file) {
        const { filename } = req.file;
        avatar = process.env.IMAGE_PATH + "/static/" + filename;
      }

      // old image delete
      const user = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { id: +id },
      });
      if (user && avatar != undefined) {
        const filePath = user?.avatar;
        const imageToDelete = filePath.replace(
          process.env.IMAGE_PATH + "/static/",
          ""
        );
        const imagePath = path.join(process.cwd(), "uploads", imageToDelete);
        fs.unlinkSync(imagePath);
      } else {
        console.log("xato");
      }

      user.username = username != "" ? username : user.username;
      user.phone = phone != "" ? phone : user.phone;
      user.password = password != "" ? password : user.password;
      user.role = role != "" ? role : user.role;
      user.time_date = time_date != undefined ? new Date(time_date) : user.time_date;
      user.trial = trial != "" ? trial : user.trial;
      user.avatar = avatar != undefined ? avatar : user.avatar;

      await AppDataSource.manager.save(user);

      res.json({
        status: 200,
        message: "users updated",
        data: user,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async Delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const oldData = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { id: +id },
      });
      if (oldData) {
        const filePath = oldData?.avatar;
        const imageToDelete = filePath.replace(
          process.env.IMAGE_PATH + "/static/",
          ""
        );
        const imagePath = path.join(process.cwd(), "uploads", imageToDelete);
        fs.unlinkSync(imagePath);
      } else {
        console.log("xato");
      }
      const users = await AppDataSource.getRepository(UsersEntity)
        .createQueryBuilder()
        .delete()
        .from(UsersEntity)
        .where({ id })
        .returning("*")
        .execute();

      res.json({
        status: 200,
        message: "users deleted",
        data: users.raw[0],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CategoryController();
