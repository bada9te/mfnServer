import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, mongo } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";
import { BattleDocument } from "../battles/battles.schema";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true })
    receiver: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true })
    sender: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true })
    post: PostDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Battle', autopopulate: true })
    battle: BattleDocument;

    @Prop({ required: true })
    type: "SUBSCRIBED" | "BATTLE_CREATED" | "BATTLE_FINISHED" | "POST_REPORTED" | "POST_CREATED" | "SYSTEM";

    @Prop({ required: true })
    text: string;

    @Prop({ default: false })
    checked: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);