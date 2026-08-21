import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { Exclude } from 'class-transformer';

@Entity('users')
export class Users {
    @PrimaryColumn('uuid')
    id!: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email!: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @IsString()
    @Exclude()
    @Column()
    password!: string;

    @IsString()
    @Column({ nullable: true })
    avatar?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}