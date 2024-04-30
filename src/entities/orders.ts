import { IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { ClientsEntity } from "./clients";
import { UsersEntity } from "./users";

@Entity({ name: "ordes" })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  @IsString()
  title: string;

  @Column({ type: "decimal" })
  @IsString()
  price_region: number;

  @Column({ type: "int" })
  @IsString()
  count: number;

  @Column({ type: "decimal" })
  @IsString()
  weight: number;

  @Column({ type: "text" })
  @IsString()
  type: string;

  @Column({ type: "text" })
  @IsString()
  logistica: string;

  @Column({ type: "decimal" })
  priceAll: number;

  @Column({ type: "decimal" })
  logisticaPrice: number;

  @Column({ type: "decimal" })
  logisticaPriceAll: number;

  @Column({ type: "decimal" })
  productPrice: number;

  @Column({ type: "decimal" })
  productPriceAll: number;

  @Column({ type: "text", default: "purchased" })
  @IsString()
  status: string;

  @Column({ type: "text" })
  @IsString()
  priceTitle: string;

  @Column({ type: "text" })
  @IsString()
  image: string;

  @Column({ type: "text", nullable: true })
  @IsString()
  link: string;

  @Column({ type: "text", nullable: true })
  @IsString()
  orderPrice: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;

  @ManyToMany(() => ClientsEntity, (clients) => clients.orders, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  clients: ClientsEntity[];

  @ManyToOne(() => UsersEntity, (user) => user.orders, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: UsersEntity;
}
