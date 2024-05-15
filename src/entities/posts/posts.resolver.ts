import { Args, Resolver, Query } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { PostsByTitleDto } from "./dto";


@Resolver('Post')
export class PostsResolver {
    constructor(private postsService: PostsService) {}

    @Query()
    async post(@Args('_id') _id: string) {
        return await this.postsService.getPostById(_id);
    }

    @Query()
    async posts(
        @Args('offset') offset: number,
        @Args('limit') limit: number
    ) {
        return {
            posts: await this.postsService.getAllPosts({ offset, limit }),
            count: await this.postsService.getDocsCount({}),
        }
    }

    @Query()
    async postsByOwner(
        @Args('owner') owner: string,
        @Args('offset') offset: number,
        @Args('limit') limit: number
    ) {
        return {
            posts: await this.postsService.getAllWithOwnerId(owner,{ offset, limit }),
            count: await this.postsService.getDocsCount({ owner }),
        }
    }

    @Query()
    async postsSavedByUser(
        @Args('user') user: string,
        @Args('offset') offset: number,
        @Args('limit') limit: number
    ) {
        return {
            posts: await this.postsService.getSavedPostsByUserId(user, { offset, limit }),
            count: await this.postsService.getDocsCount({ savedBy: user }),
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
        @Args('offset') offset: number,
        @Args('limit') limit: number,
    ) {
        return {
            posts: await this.postsService.getPostsByCategory(category, { offset, limit }),
            count: await this.postsService.getDocsCount({ category }),
        }
    }
}