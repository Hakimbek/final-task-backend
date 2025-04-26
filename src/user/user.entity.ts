import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, OneToMany } from "typeorm";
import { Template } from "../template/template.entity";
import { Response } from "../response/response.entity";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    firstname: string;

    @Column({ nullable: false })
    lastname: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: '' })
    image: string;

    @Column({ default: true, nullable: false })
    isActive: boolean;

    @Column({ default: false, nullable: false })
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Template, template => template.user, {
        cascade: true
    })
    templates: Template[];

    @OneToMany(() => Response, response => response.user, {
        cascade: true
    })
    responses: Response[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
