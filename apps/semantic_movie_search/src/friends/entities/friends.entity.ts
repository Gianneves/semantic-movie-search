import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { Users } from "../../users/entities/users.entity";

export enum FriendshipStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED'
}

@Entity('friends')
@Unique(['requester', 'addressee'])
export class Friends {
    @PrimaryColumn('uuid')
    id!: string;

    @ManyToOne(() => Users, user => user.sentFriendRequests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'requester_id' })
    requester!: Users;

    @ManyToOne(() => Users, user => user.receivedFriendRquests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'addressee_id' })
    addressee!: Users;

    @Column({
        type: 'enum',
        enum: FriendshipStatus,
        default: FriendshipStatus.PENDING
    })
    status!: FriendshipStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}