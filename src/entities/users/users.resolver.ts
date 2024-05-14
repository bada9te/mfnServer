import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { SwicthSubscriptionDto, UpdateUserDto, CreateUserDto, ConfirmAccountDto, RestoreAccountDto } from "./dto";
import { ModerationsService } from "../moderations/moderations.service";

@Resolver('User')
export class UsersResolver {
    constructor(private usersService: UsersService) {}

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
    async userUpdate(@Args('input') { _id, what, value }: UpdateUserDto) {
        return await this.usersService.updateUser(_id, value, what);
    }

    @Mutation()
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
    
    // userPrepareAccountToRestore
}