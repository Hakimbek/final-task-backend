import { BadRequestException, Controller, Get } from "@nestjs/common";
import { TopicService } from "./topic.service";

@Controller("topic")
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get()
    async getAllTopics() {
        try {
            return await this.topicService.getAllTopics();
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
