import { Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";

@Resolver('User')
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query('user')
    async user() {
        return {a: "b"}
    }
}