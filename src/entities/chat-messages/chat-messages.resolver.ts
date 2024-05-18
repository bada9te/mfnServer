import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { ChatMessagesService } from "./chat-messages.service";
import { ParseIntPipe } from "@nestjs/common";
import { UpdateChatMessageDto } from "./dto";


@Resolver('ChatMessage')
export class ChatMessagesResolver {
    constructor(private chatMessagesService: ChatMessagesService) {}

    @Query()
    async chatMessage(@Args('_id') _id: string) {
        return await this.chatMessagesService.getMessageById(_id);
    }

    @Query()
    async chatMessagesByChatId(
        @Args('_id') _id: string,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        return await this.chatMessagesService.getMessagesByChat(_id, { offset, limit });
    }

    // chatMessageCreate


    @Mutation()
    async chatMessageDeleteById(@Args('_id') _id: string) {
        return await this.chatMessagesService.deleteMessageById(_id);
    }

    @Mutation()
    async chatMessageUpdate(@Args('input') {_id, text}: UpdateChatMessageDto) {
        return await this.chatMessagesService.updateMessage(_id, text);
    }
}