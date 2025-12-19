import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { CreatePostDto, PostsByTitleDto, SwicthLikeOrSaveDto, UpdatePostDto } from "./dto";
import { BadRequestException, ParseIntPipe, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../auth/strategy/graphql/gql.guard";
import { UserDocument } from "../users/users.schema";
import { CurrentUser } from "../../auth/strategy/graphql/gql.decorator";


@Resolver('Post')
export class PostsResolver {
    constructor(private postsService: PostsService) {}

    private validateUserAccess(userId: string, currentUser: UserDocument) {
        if (currentUser._id.toString() !== userId.toString()) {
            throw new BadRequestException('User access violation!');
        }
    }

    @Query()
    async post(@Args('_id') _id: string) {
        return await this.postsService.getPostById(_id);
    }

    @Query()
    async posts(
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        return {
            posts: await this.postsService.getAllPosts({ offset, limit }),
            count: await this.postsService.getDocsCount({}),
        }
    }

    @Query()
    async postsByOwner(
        @Args('owner') owner: string,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        return {
            posts: await this.postsService.getAllWithOwnerId(owner,{ offset, limit }),
            count: await this.postsService.getDocsCount({ owner }),
        }
    }

    @Query()
    async postsByTitle(@Args('input') dto: PostsByTitleDto) {
        const { userId, title, userIsOwner } = dto;

        if (userId) {
            return await this.postsService.getByTitleWithUserId(title, userIsOwner as boolean, userId);
        } else {
            return await this.postsService.getByTitle(title);
        }
    }

    @Query()
    async postsByIds(@Args('ids') ids: string[]) {
        return await this.postsService.getManyByIds(ids);
    }

    @Query()
    async postsMostPopular(@Args('date') date: string) {
        return await this.postsService.getMostPopularPostsByStartDate(new Date(date));
    }

    @Query()
    async postsByCategory(
        @Args('category') category: string,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number,
    ) {
        return {
            posts: await this.postsService.getPostsByCategory(category, { offset, limit }),
            count: await this.postsService.getDocsCount({ category }),
        }
    }

    @Query()
    async postsSavedByUser(
        @Args('user') user: string,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        return {
            posts: await this.postsService.getSavedPostsByUserId(user, { offset, limit }),
            count: await this.postsService.getDocsCount({ savedBy: user }),
        }
    }

    @Query()
    async postsByCategoryCount() {
        return await this.postsService.getDocsCountByCategories();
    }

    @Query()
    async postsMostRecent() {
        return await this.postsService.getMostRecentTracks();
    }

    @Query()
    async postsMostRecentByFollowing(@Args('user') userId: string) {
        return await this.postsService.getMostRecentTracksByFollowing(userId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async postCreate(@Args('input') dto: CreatePostDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(dto.owner, user);
        return await this.postsService.addPost(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async postUpdate(@Args('input') { post, value, what }: UpdatePostDto, @CurrentUser() user: UserDocument) {
        const postData = await this.postsService.getPostById(post);
        this.validateUserAccess(postData?.owner._id.toString() as string, user);
        return await this.postsService.updatePost(post, value, what);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async postDeleteById(@Args('_id') _id: string, @CurrentUser() user: UserDocument) {
        const postData = await this.postsService.getPostById(_id);
        this.validateUserAccess(postData?.owner._id.toString() as string, user);
        return await this.postsService.deletePostById(_id);
    }
}