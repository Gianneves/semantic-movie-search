import { IsNumber, IsString, Max, Min } from "class-validator";
import { Movie } from "src/movie/entities/movie.entity";
import { Users } from "src/users/entities/users.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";

@Entity('reviews')
@Unique(['user', 'movie'])
export class Review {
  @PrimaryColumn('uuid')
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @IsNumber()
  @Min(0)
  @Max(5)
  @Column('float')
  rating!: number;

  @IsString()
  @Column({ nullable: true })
  review!: string;

  @ManyToOne(() => Movie, movie => movie.reviews)
  @JoinColumn({ name: 'movie_id' })
  movie!: Movie;

  @ManyToOne(() => Users, user => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user!: Users;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

}