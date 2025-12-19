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
            password: { type: String, select: false }
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

    @Prop({
        _id: false,
        type: {
            address: { type: String },
            message: { type: String },
            signed: { type: String },
        }
    })
    web3: {
        address: string,
        message: string,
        signed: string,
    }
    
    @Prop({ type: String })
    nick: string;

    @Prop({ type: String, default: "Hello there, I am a newbie!" })
    description: string;

    @Prop({ type: String, default: "" })
    avatar: string;

    @Prop({ type: String, default: "" })
    background: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribers: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    subscribedOn: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    likedPosts: PostDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    savedPosts: PostDocument[];

    @Prop({ type: Boolean, default: false })
    verified: boolean;

    @Prop({ type: Number, default: 0 })
    level: number;

    @Prop({ type: Number, default: [] })
    achievements: number[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }] })
    pinnedPosts: PostDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(require("mongoose-autopopulate"));
