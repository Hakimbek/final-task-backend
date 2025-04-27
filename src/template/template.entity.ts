import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "../user/user.entity";
import { Question } from "../question/question.entity";
import { Response } from "../response/response.entity";

@Entity()
export class Template {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    topic: string;

    @Column("text", { default: [], array: true })
    tags: string[];

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.templates, {
        onDelete: "CASCADE",
        eager: true,
    })
    user: User;

    @OneToMany(() => Question, question => question.template, {
        cascade: true,
        eager: true,
    })
    questions: Question[];

    @OneToMany(() => Response, response => response.template, {
        cascade: true
    })
    responses: Response[];
}
