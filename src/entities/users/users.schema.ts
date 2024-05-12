import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop(raw({
        local: {
            email: String,
            password: String,
        }
    }))
    local: Record<string, any>;
    

    @Prop(raw({
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String,
        }
    }))
    facebook: Record<string, any>;
    

    @Prop(raw({
        twitter: {
            id: String,
            token: String,
            email: String,
            displayName: String,
            username: String,
        }
    }))
    twitter: Record<string, any>;
    

    @Prop(raw({
        google: {
            id: String,
            token: String,
            email: String,
            name: String,
        }
    }))
    google: Record<string, any>;
    

    @Prop()
    nick: string;

    @Prop()
    description: string;

    @Prop()
    avatar: string;

    @Prop()
    background: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribers: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribedOn: UserDocument[];

    @Prop({ default: false })
    verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);