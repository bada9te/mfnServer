import { Args, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";

@Resolver('User')
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query('user')
    async user(@Args('_id') _id: string) {
        return await this.usersService.getUserById(_id);
    }

    @Query('userByEmail')
    async userByEmail(@Args('email') email: string) {
        return await this.usersService.getUserByEmail(email);
    }

    @Query('usersByIds')
    async usersByIds(@Args('ids') ids: string[]) {
        return await this.usersService.getUsersByIds(ids);
    }

    @Query('usersByNickname')
    async usersByNickname(@Args('nick') nick: string) {
        return await this.usersService.getUsersByNickname(nick);
    }
}