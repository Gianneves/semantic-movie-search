import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";

@Entity('movies')
export class Movie {
    @PrimaryColumn('uuid')
    id!: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    original_title!: string;


    @IsNotEmpty()
    @IsString()
    @Column()
    overview!: string;

    @IsNotEmpty()
    @IsNumber()
    @Column('float')
    popularity!: number;

    @IsNotEmpty()
    @IsString()
    @Column()
    release_date!: string;

    @IsNotEmpty({ each: true })
    @IsArray()
    @Column('simple-array')
    genres!: string[]

    @Column({ type: 'vector', length: 1536, nullable: true })
    embedding?: number[] | null;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;


    @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}