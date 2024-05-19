import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { ChatMessagesService } from "./chat-messages.service";
import { ParseIntPipe, UseGuards } from "@nestjs/common";
import { UpdateChatMessageDto } from "./dto";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";


@Resolver('ChatMessage')
export class ChatMessagesResolver {
    constructor(private chatMessagesService: ChatMessagesService) {}

    @Query()
    @UseGuards(GqlAuthGuard)
    async chatMessage(@Args('_id') _id: string) {
        return await this.chatMessagesService.getMessageById(_id);
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async chatMessagesByChatId(
        @Args('_id') _id: string,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        return await this.chatMessagesService.getMessagesByChat(_id, { offset, limit });
    }

    // chatMessageCreate


    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatMessageDeleteById(@Args('_id') _id: string) {
        return await this.chatMessagesService.deleteMessageById(_id);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatMessageUpdate(@Args('input') {_id, text}: UpdateChatMessageDto) {
        return await this.chatMessagesService.updateMessage(_id, text);
    }
}