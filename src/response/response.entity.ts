import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique, OneToMany } from "typeorm";
import { User } from "../user/user.entity";
import { Template } from "../template/template.entity";
import { Answer } from "../answer/answer.entity";

@Entity()
@Unique(["user", "template"])
export class Response {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.responses, {
        onDelete: "CASCADE",
        eager: true
    })
    user: User;

    @ManyToOne(() => Template, template => template.responses, {
        onDelete: "CASCADE",
        eager: true
    })
    template: Template;

    @OneToMany(() => Answer, answer => answer.response, {
        cascade: true,
        eager: true
    })
    answers: Answer[];

    @CreateDateColumn()
    createdAt: Date;
}
