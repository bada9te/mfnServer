import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "src/entities/users/users.schema";

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ required: true })
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true })
    owner: UserDocument;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }] })
    participants: UserDocument[];

    @Prop({
        type: [{
            count: { type: Number },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }],
        default: []
    })
    messagesUnreadCount: { count: number, user: UserDocument }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);