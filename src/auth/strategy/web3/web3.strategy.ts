import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-dapp-web3";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";

@Injectable()
export class Web3OauthStrategy extends PassportStrategy(Strategy, 'web3') {
    constructor(private jwtAuthService: JwtAuthService) {
        super({
            addressField: 'address',
            messageField: 'message',
            signedField: 'signed',
            session: false
        });
    }

    async validate(@Req() _req: Request, address: string, done: any) {
        console.log("WEB-3 VALIDATE:", {address, done});
        throw new UnauthorizedException();

        // TODO: find (create if needed) user by address in DB and return it
        /*
        const user = await this.jwtAuthService.processLocal(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
        */
    }
}