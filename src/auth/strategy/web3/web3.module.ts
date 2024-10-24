import { Module } from "@nestjs/common";
import { Web3OauthStrategy } from "./web3.strategy";
import { UsersModule } from "src/entities/users/users.module";
import { JwtAuthModule } from "../jwt/jwt.module";
import { Web3OauthController } from "./web3.controller";


@Module({
    imports: [UsersModule, JwtAuthModule],
    controllers: [Web3OauthController],
    providers: [Web3OauthStrategy],
})
export class Web3OauthModule {}
