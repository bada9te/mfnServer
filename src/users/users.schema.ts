import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    local: {
        email: string;
        password: string;
    }

    @Prop()
    facebook: {
        id: string;
        token: string;
        email: string;
        name: string;
    }

    @Prop()
    twitter: {
        id: string;
        token: string;
        email: string;
        displayName: string;
        username: string;
    }
    
    @Prop()
    google: {
        id: string;
        token: string;
        email: string;
        name: string;
    }

    @Prop()
    nick: string;

    @Prop()
    description: string;

    @Prop()
    avatar: string;

    @Prop()
    background: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribers: User[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribedOn: User[];

    @Prop({ default: false })
    verified: boolean;
}