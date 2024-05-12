import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Chat } from "src/entities/chats/chats.schema";
import { User } from "src/entities/users/users.schema";

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({ timestamps: true })
export class ChatMessage {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true })
    chat: Chat;

    @Prop({ required: true })
    type: string;

    // for type text
    @Prop()
    text: string;

    // for type photo
    @Prop()
    image: string;

    // for type video
    @Prop()
    video: string;

    // for type audio
    @Prop()
    audio: string;

    // for type file
    @Prop()
    file: string;

    // for type spotify
    @Prop()
    spotify: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' })
    reply: ChatMessage;
}