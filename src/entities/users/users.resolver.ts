import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { SwicthSubscriptionDto, UpdateUserDto, CreateUserDto, ConfirmAccountDto, RestoreAccountDto, PrepareToRestoreDto, LinkEmailDto } from "./dto";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";
import { CurrentUser } from "src/auth/strategy/graphql/gql.decorator";
import { UserDocument } from "./users.schema";
import { SwicthLikeOrSaveDto } from "./dto/swicth-like-or-save.dto";


@Resolver('User')
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    private validateUserAccess(userId: string, currentUser: UserDocument) {
        if (currentUser._id.toString() !== userId.toString()) {
            throw new BadRequestException('User access violation!');
        }
    }

    @UseGuards(GqlAuthGuard)
    async whoAmI(@CurrentUser() user: UserDocument) {
        return this.usersService.getUserById(user._id.toString());
    }

    @Query()
    async user(@Args('_id') _id: string) {
        return await this.usersService.getUserById(_id);
    }

    @Query()
    async userByEmail(@Args('email') email: string) {
        return await this.usersService.getUserByEmail(email);
    }

    @Query()
    async usersByIds(@Args('ids') ids: string[]) {
        return await this.usersService.getUsersByIds(ids);
    }

    @Query()
    async usersByNickname(@Args('nick') nick: string) {
        return await this.usersService.getUsersByNickname(nick);
    }

    @Query()
    async userAchievementsData(@Args('_id') _id: string) {
        return await this.usersService.calculateAchievements(_id);
    }

    @Query()
    async userPinnedTracks(@Args('_id') _id: string) {
        return await this.usersService.getPinnedPosts(_id);
    }

    @Mutation()
    async userCreate(@Args('input') input: CreateUserDto) {
        return await this.usersService.addUser(input);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userUpdate(@Args('input') { _id, what, value }: UpdateUserDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(_id, user);
        return await this.usersService.updateUser(_id, value, what);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userSwitchSubscription(@Args('input') { subscriberId, userId }: SwicthSubscriptionDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(subscriberId, user);
        return await this.usersService.swicthUserSubscription(subscriberId, userId);
    }

    @Mutation()
    async userConfirmAccount(@Args('input') dto: ConfirmAccountDto) {
        return await this.usersService.confirmUserAccount(dto);
    }

    @Mutation()
    async userRestoreAccount(@Args('input') dto: RestoreAccountDto) {
        return await this.usersService.restoreAccount(dto);
    }
    
    @Mutation()
    async userPrepareAccountToRestore(@Args('input') dto: PrepareToRestoreDto) {
        return await this.usersService.prepareAccountToRestore(dto);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation()
    async userUnlinkGoogle(@Args('_id') _id: string, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(_id, user);
        return await this.usersService.unlinkGoogle(_id);
    }


    @UseGuards(GqlAuthGuard)
    @Mutation()
    async userUnlinkFacebook(@Args('_id') _id: string, @CurrentUser() user: UserDocument) {
        if (user._id.toString() !== _id.toString()) {
            throw new BadRequestException('User access violation!');
        }
        return await this.usersService.unlinkFacebook(_id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation()
    async userUnlinkTwitter(@Args('_id') _id: string, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(_id, user);
        return await this.usersService.unlinkTwitter(_id);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userSwitchLike(@Args('input') dto: SwicthLikeOrSaveDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(dto.userId, user);
        return await this.usersService.switchPostInLiked(dto.postId, dto.userId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userSwitchSave(@Args('input') dto: SwicthLikeOrSaveDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(dto.userId, user);
        return await this.usersService.switchPostInSaved(dto.postId, dto.userId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userSwitchPostPinned(@Args('userId') userId: string, @Args('postId') postId: string, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(userId, user);
        return await this.usersService.switchPostPinned(postId, userId);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userLinkEmailRequest(@Args('input') input: LinkEmailDto, @CurrentUser() user: UserDocument) {
        this.validateUserAccess(input.userId, user);
        return await this.usersService.linkEmailRequest(input.email, input.userId);
    }
}