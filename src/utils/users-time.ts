import { AppDataSource } from "../data-source";
import { UsersEntity } from "../entities/users";

export async function updateStatus() {
  const users = await AppDataSource.getRepository(UsersEntity).find();

  users.forEach(async (user) => {
    const currentTime = new Date();
    try {
      if (user.time_date.getTime() <= currentTime.getTime()) {
        await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .update(UsersEntity)
          .set({ trial: false })
          .where({ trial: true, id: user.id })
          .returning("*")
          .execute();
      }
    } catch (error) {
      console.log(error);
    }
  });
}
