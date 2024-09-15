import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { CreatePostDto, PostsByTitleDto, SwicthLikeOrSaveDto, UpdatePostDto } from "./dto";
import { ParseIntPipe, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";


@Resolver('Post')
export class PostsResolver {
    constructor(private postsService: PostsService) {}

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
            return await this.postsService.getByTitleWithUserId(title, userIsOwner, userId);
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
    async postCreate(@Args('input') dto: CreatePostDto) {
        return await this.postsService.addPost(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async postUpdate(@Args('input') { post, value, what }: UpdatePostDto) {
        return await this.postsService.updatePost(post, value, what);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async postDeleteById(@Args('_id') _id: string) {
        return await this.postsService.deletePostById(_id);
    }
}