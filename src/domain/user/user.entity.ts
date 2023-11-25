import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Moment } from 'moment';

enum GENDER_ENUM {
    M = 'M',
    F = 'F',
    N = 'N',
}

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
        type: 'varchar',
        name: 'username',
        length: 64,
        nullable: false,
        unique: true,
        comment: 'username of user',
    })
    public username: string;

    @Column({
        type: 'char',
        name: 'password',
        length: 128,
        nullable: false,
        unique: false,
        comment: 'digested password of user',
    })
    public password: string;

    @Column({
        type: 'char',
        name: 'salt',
        length: 128,
        nullable: false,
        unique: false,
        comment: 'salt for digest password of user',
    })
    public salt: string;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 64,
        nullable: true,
        unique: false,
        comment: 'name number of user',
    })
    public name: string;

    @Column({
        type: 'char',
        name: 'phone',
        length: 11,
        nullable: true,
        unique: false,
        comment: 'phone number of user',
    })
    public phone: string;

    @Column({
        type: 'text',
        name: 'website',
        default: '',
        nullable: false,
        unique: false,
        comment: 'website address of user',
    })
    public website: string;

    @Column({
        type: 'enum',
        name: 'gender',
        enum: GENDER_ENUM,
        nullable: false,
        unique: false,
        default: GENDER_ENUM.N,
        comment: 'gender of user',
    })
    public gender: GENDER_ENUM;

    @Column({
        type: 'varchar',
        name: 'college',
        length: 64,
        nullable: true,
        unique: false,
        comment: 'collage information of user',
    })
    public college: string;

    @Column({
        type: 'varchar',
        name: 'major',
        length: 64,
        nullable: true,
        unique: false,
        comment: 'major information of user',
    })
    public major: string;

    @Column({
        type: 'boolean',
        name: 'academic_status',
        nullable: true,
        unique: false,
        comment: 'academic status of user',
    })
    public academicStatus: boolean;

    @Column({
        type: 'varchar',
        name: 'student_number',
        length: 16,
        nullable: true,
        unique: true,
        comment: 'student number of user',
    })
    public studentNumber: string | null;

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
        name: 'is_activate',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if user is activate or not',
    })
    public isActivate: boolean;

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
        name: 'is_official',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if user is official or not',
    })
    public isOfficial: boolean;

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

    constructor(
        username: string,
        password: string,
        salt: string,
        phone: string,
        website: string,
        name: string | null,
        studentNumber: string | null,
        isIndividual: boolean,
        isOfficial: boolean,
    ) {
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.phone = phone;
        this.website = website;
        this.name = name;
        this.studentNumber = studentNumber;
        this.isIndividual = isIndividual;
        this.isOfficial = isOfficial;
    }
}
