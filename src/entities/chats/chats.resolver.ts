import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { ChatsService } from "./chats.service";
import { ChatUpdateDto, CreateChatDto } from "./dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";


@Resolver('Chat') 
export class ChatsResolver {
    constructor(private chatsService: ChatsService) {}

    @Query()
    @UseGuards(GqlAuthGuard)
    async chat(
        @Args('_id') _id: string, 
        @Args('userId', { nullable: true }) userId: string
    ) {
        userId && await this.chatsService.updateMessagesUnreadCount(_id, userId);
        return await this.chatsService.getChatById(_id);
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async chatsByIds(@Args('ids') ids: string[]) {
        return await this.chatsService.getManyChatsByIds(ids);
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async chatsUserRelatedByUserId(@Args('_id') userId: string) {
        return await this.chatsService.getUserRelatedChats(userId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatCreate(@Args('input') dto: CreateChatDto) {
        return await this.chatsService.createChat(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatUpdate(@Args('input') {_id, what, value}: ChatUpdateDto) {
        return await this.chatsService.updateChat(_id, what, value);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatReadAllMessages(
        @Args('chatId') chatId: string,
        @Args('userId') userId: string
    ) {
        return await this.chatsService.updateMessagesUnreadCount(chatId, userId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatSwitchParticipants(
        @Args('chatId') chatId: string,
        @Args('participants') participants: string[]
    ) {
        return await this.chatsService.switchParticipants(chatId, participants);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatSwitchMessage(
        @Args('chatId') chatId: string,
        @Args('messageId') messageId: string
    ) {
        return await this.chatsService.swicthMessage(chatId, messageId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async chatDeleteById(@Args('_id') _id: string) {
        return await this.chatsService.deleteChatById(_id);
    }
}