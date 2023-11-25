import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Moment } from 'moment';

@Entity({
    name: 'USER',
    orderBy: {
        id: 'DESC',
    },
    synchronize: true,
})
export default class UserEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({
        type: 'char',
        name: 'phone',
        length: 11,
        nullable: false,
        unique: true,
        comment: 'phone number of user',
    })
    public phone: string;

    @Column({
        type: 'varchar',
        name: 'email',
        length: 128,
        nullable: true,
        unique: true,
        comment: 'email address of user',
    })
    public email: string;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 64,
        nullable: true,
        unique: false,
        comment: 'name of user',
    })
    public name: string;

    @Column({
        type: 'text',
        name: 'image',
        nullable: false,
        unique: false,
        default: '',
        comment: 'profile image address of user',
    })
    public image: string;

    @Column({
        type: 'boolean',
        name: 'is_individual',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if user is individual or not',
    })
    public isIndividual: boolean;

    @Column({
        type: 'boolean',
        name: 'is_manager',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if user is manager or not',
    })
    public isManager: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        update: false,
        comment: 'created timestamp',
    })
    public readonly createdAt: Moment;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        update: false,
        comment: 'updated timestamp',
    })
    public readonly updatedAt: Moment;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
        update: false,
        default: null,
        comment: 'deleted timestamp',
    })
    public readonly deletedAt: Moment | null;

    constructor(phone: string, email: string, name: string) {
        this.phone = phone;
        this.email = email;
        this.name = name;
    }
}
