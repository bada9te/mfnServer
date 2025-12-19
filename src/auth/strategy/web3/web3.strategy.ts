import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-dapp-web3";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { UserDocument } from "../../../entities/users/users.schema";

@Injectable()
export class Web3OauthStrategy extends PassportStrategy(Strategy, 'web3') {
    constructor(private jwtAuthService: JwtAuthService, private configService: ConfigService) {
        super({
            addressField: 'address',
            messageField: 'message',
            signedField: 'signed',
            session: false
        });
    }

    async validate(address: string, message: string, signed: string, done: any) {
        let user: UserDocument | null;

        user = await this.jwtAuthService.processWeb3(address, message, signed);

        if (!user) {
            throw new UnauthorizedException();
        }
        done(null, user);
    }
}