import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { Exclude } from 'class-transformer';
import { Review } from "src/review/entities/review.entity";
import { List } from "src/list/entities/list.entity";

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

    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => List, list => list.owner)
    ownedLists!: List[];

    @ManyToMany(() => List, list => list.members)
    sharedLists!: List[];

    @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}