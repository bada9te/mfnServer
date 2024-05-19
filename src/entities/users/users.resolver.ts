import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { SwicthSubscriptionDto, UpdateUserDto, CreateUserDto, ConfirmAccountDto, RestoreAccountDto, PrepareToRestoreDto } from "./dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";
import { CurrentUser } from "src/auth/strategy/graphql/gql.decorator";
import { UserDocument } from "./users.schema";


@Resolver('User')
export class UsersResolver {
    constructor(private usersService: UsersService) {}

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

    @Mutation()
    async userCreate(@Args('input') input: CreateUserDto) {
        return await this.usersService.addUser(input);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userUpdate(@Args('input') { _id, what, value }: UpdateUserDto) {
        return await this.usersService.updateUser(_id, value, what);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async userSwitchSubscription(@Args('input') { subscriberId, userId }: SwicthSubscriptionDto) {
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
}