import { IsNotEmpty, IsString } from "class-validator";
import { Movie } from "src/movie/entities/movie.entity";
import { Users } from "src/users/entities/users.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";

@Entity('lists')
export class List {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    title!: string;

    @ManyToOne(() => Users, user => user.ownedLists)
    @JoinColumn({ name: 'owner_id' })
    owner!: Users;

    @ManyToMany(() => Users, user => user.sharedLists)
    @JoinTable({
        name: 'list_users',
        joinColumn: { name: 'list_id', referencedColumnName: 'id' }
    })
    members!: Users[];

    @ManyToMany(() => Movie, movie => movie.lists)
    @JoinTable({
        name: 'list_movies',
        joinColumn: { name: 'list_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'movie_id', referencedColumnName: 'id' }
    })
    movie!: Movie[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}