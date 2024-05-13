import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "src/entities/users/users.schema";

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ required: true })
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: UserDocument;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: UserDocument[];

    @Prop(raw({
        type: [{
            count: Number,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        default: []
    }))
    messagesUnreadCount: Record<number, UserDocument>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);