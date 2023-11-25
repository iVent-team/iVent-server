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
    name: 'IVENT',
    orderBy: {
        id: 'DESC',
    },
    synchronize: true,
})
export default class IventEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({
        type: 'integer',
        name: 'host_id',
        nullable: false,
        unique: false,
        comment: 'id of host',
    })
    public hostId: number;

    @Column({
        type: 'varchar',
        name: 'title',
        length: 64,
        nullable: false,
        unique: false,
        comment: 'title of ivent',
    })
    public title: string;

    @Column({
        type: 'text',
        name: 'description',
        nullable: false,
        unique: false,
        comment: 'digested password of user',
    })
    public description: string;

    @Column({
        type: 'text',
        name: 'address',
        nullable: false,
        unique: false,
        comment: 'digested password of user',
    })
    public address: string;

    @Column({
        type: 'timestamp',
        name: 'recruitment_till',
        nullable: false,
        unique: false,
        comment: 'recruitment due moment',
    })
    public readonly recruitmentTill: Moment;

    @Column({
        type: 'timestamp',
        name: 'start_at',
        nullable: false,
        unique: false,
        comment: 'start moment',
    })
    public readonly startAt: Moment;

    @Column({
        type: 'boolean',
        name: 'is_reviewed',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if ivent is reviewed or not',
    })
    public isReviewed: boolean;

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
        hostId: number,
        title: string,
        description: string,
        address: string,
        recruitmentTill: Moment,
        startAt: Moment,
    ) {
        this.hostId = hostId;
        this.title = title;
        this.description = description;
        this.address = address;
        this.recruitmentTill = recruitmentTill;
        this.startAt = startAt;
    }

    public async getJsonResponse() {
        return {
            id: this.id,
            hostId: this.hostId,
            title: this.title,
            description: this.description,
            address: this.address,
            recruitmentTill: Number(this.recruitmentTill),
            startAt: Number(this.startAt),
            isReviewed: this.isReviewed,
            createdAt: this.createdAt,
        };
    }
}

@Entity({
    name: 'IVENT_ATTENDANCE',
    orderBy: {
        id: 'DESC',
    },
    synchronize: true,
})
export class IventAttendanceEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({
        type: 'integer',
        name: 'ivent_id',
        nullable: false,
        unique: false,
        comment: 'id of ivent',
    })
    public iventId: number;

    @Column({
        type: 'integer',
        name: 'attendee_id',
        nullable: false,
        unique: false,
        comment: 'id of attendee',
    })
    public attendeeId: number;

    @Column({
        type: 'boolean',
        name: 'is_reviewed',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if attendance is reviewed or not',
    })
    public isReviewed: boolean;

    @Column({
        type: 'boolean',
        name: 'is_rated',
        default: false,
        nullable: false,
        unique: false,
        comment: 'flag if attendee has rated or not',
    })
    public isRated: boolean;

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

    constructor(iventId: number, attendeeId: number) {
        this.iventId = iventId;
        this.attendeeId = attendeeId;
    }

    public async getJsonResponse() {
        return {
            id: this.id,
            iventId: this.iventId,
            attendeeId: this.attendeeId,
            isReviewed: this.isReviewed,
            isRated: this.isRated,
            createdAt: this.createdAt,
        };
    }
}
