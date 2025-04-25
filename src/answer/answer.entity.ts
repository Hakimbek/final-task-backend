import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "../question/question.entity";
import { Response } from "../response/response.entity";

@Entity()
export class Answer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Response, response => response.answers, {
        onDelete: "CASCADE"
    })
    response: Response;

    @ManyToOne(() => Question, question => question.answers, {
        onDelete: "CASCADE"
    })
    question: Question;

    @Column({ nullable: false })
    value: string;
}
