import { IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { KargosEntity } from "./kargos";

@Entity({ name: "users" })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  @IsString()
  username: string;

  @Column({ type: "varchar" })
  @IsString()
  phone: string;

  @Column({ type: "text" })
  @IsString()
  avatar: string;

  @Column({ type: "varchar", nullable: true })
  password: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;

  @OneToMany(() => KargosEntity, (kargos) => kargos.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  kargos: KargosEntity[];
} 
