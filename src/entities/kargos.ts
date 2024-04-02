import { IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { UsersEntity } from "./users";

@Entity({ name: "kargos" })
export class KargosEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  @IsString()
  title: string;

  @Column({ type: "decimal", nullable: true })
  simplePrice: number;

  @Column({ type: "decimal", nullable: true })
  expensive: number;

  @Column({ type: "varchar" })
  @IsString()
  typeTitleSimple: string;

  @Column({ type: "varchar" })
  @IsString()
  typeTitleExpensive: string;

  @Column({ type: "varchar" })
  @IsString()
  date: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.kargos, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: UsersEntity;
}
