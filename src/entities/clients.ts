import { IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { OrdersEntity } from "./orders";
import { UsersEntity } from "./users";

@Entity({ name: "clients" })
export class ClientsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  @IsString()
  firstName: string;

  @Column({ type: "varchar" })
  @IsString()
  lastName: string;

  @Column({ type: "varchar" })
  @IsString()
  phoneNumber1: string;

  @Column({ type: "varchar" })
  @IsString()
  phoneNumber2: string;

  @Column({ type: "text" })
  @IsString()
  location: string;

  @Column({ type: "text" })
  @IsString()
  clientNetwork: string;

  @Column({ type: "int" })
  productCount: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;

  @ManyToMany(() => OrdersEntity, (orders) => orders.clients,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable()
  orders: OrdersEntity[];

  @ManyToOne(() => UsersEntity, (user) => user.clients, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: UsersEntity;
}
