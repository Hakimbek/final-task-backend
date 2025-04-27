import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Template } from "../template/template.entity";
import { Answer } from "../answer/answer.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column({ default: true })
    isVisible: boolean;

    @Column("text", { default: [], array: true })
    options: string[];

    @Column({ nullable: false })
    type: string;

    @Column({ type: "int", nullable: false })
    order: number;

    @ManyToOne(() => Template, template => template.questions, {
        onDelete: "CASCADE"
    })
    template: Template;

    @OneToMany(() => Answer, answer => answer.question, {
        cascade: true
    })
    answers: Answer[];
}
