import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto";


@Resolver('Comment')
export class CommentsResolver {
    constructor(private commentsService: CommentsService) {}

    @Query()
    async commentsByIds(@Args('ids') ids: string[]) {
        return await this.commentsService.getAllWithIds(ids);
    }

    @Query()
    async comment(@Args('_id') _id: string) {
        return await this.commentsService.getById(_id);
    }

    @Query()
    async commentReplies(@Args('_id') _id: string) {
        const { replies } = await this.commentsService.getCommentReplies(_id);
        return replies;
    }

    @Query()
    async commentsByPostId(@Args('_id') _id: string) {
        await this.commentsService.getCommentsByPostId(_id);
    }

    @Mutation()
    async commentCreate(@Args('input') dto: CreateCommentDto) {
        await this.commentsService.addComment(dto);
    }

    @Mutation()
    async commentDeleteById(@Args('_id') _id: string) {
        await this.commentsService.removeById(_id);
    }
}