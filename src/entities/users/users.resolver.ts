import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

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
}