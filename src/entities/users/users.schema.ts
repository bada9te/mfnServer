import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "../posts/posts.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({
        _id: false,
        type: {
            email: { type: String },
            password: { type: String }
        },
    })
    local: { email: string, password: string }
    
    @Prop(raw({
        id: String,
        token: String,
        name: String,
    }))
    facebook: Record<string, any>;
    
    @Prop(raw({
        id: String,
        token: String,
        name: String,
    }))
    twitter: Record<string, any>;
    
    @Prop(raw({
        id: String,
        token: String,
        email: String,
        name: String,
    }))
    google: Record<string, any>;
    
    @Prop()
    nick: string;

    @Prop({ default: "Hello there, I am a newbie!" })
    description: string;

    @Prop({ default: "" })
    avatar: string;

    @Prop({ default: "" })
    background: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribers: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribedOn: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    likedPosts: PostDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    savedPosts: PostDocument[];

    @Prop({ default: false })
    verified: boolean;

    @Prop({ default: 0 })
    level: number;

    @Prop({ default: [] })
    achievements: number[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    pinnedPosts: PostDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
