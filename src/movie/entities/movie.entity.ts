import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";

@Entity('movies')
export class Movie {
    @PrimaryColumn('uuid')
    id!: string;

    @IsNotEmpty()
    @IsNumber()
    @Column({ unique: true })
    moviedb_id!: number

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

    @IsNotEmpty()
    @IsNumber()
    @Column()
    runtime!: number;

    @IsNotEmpty({ each: true })
    @IsArray()
    @Column('text', { array: true })
    main_cast!: string[];

    @IsString()
    @Column({ nullable: true })
    director!: string;

    @IsNotEmpty({ each: true })
    @IsArray()
    @Column('text', { array: true })
    genres!: string[];

    @IsString()
    @Column({ nullable: true })
    cover!: string;

    @IsString()
    @Column({ nullable: true })
    backdrops!: string;

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