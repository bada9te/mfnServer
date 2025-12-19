import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, mongo } from "mongoose";
import { PostDocument } from "../../entities/posts/posts.schema";
import { UserDocument } from "../../entities/users/users.schema";
import { BattleDocument } from "../battles/battles.schema";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true })
    receiver: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, autopopulate: true })
    sender: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true })
    post: PostDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Battle', autopopulate: true })
    battle: BattleDocument;

    @Prop({ type: String, required: true })
    type: "SUBSCRIBED" | "BATTLE_CREATED" | "BATTLE_FINISHED" | "POST_REPORTED" | "POST_CREATED" | "SYSTEM";

    @Prop({ type: String, required: false })
    text: string;

    @Prop({ type: Boolean, default: false })
    checked: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.post('find', function(docs) {
    docs.forEach(doc => {
        if (!doc.receiver) {
            doc.receiver = {
                _id: '000000000000000000000000',
                nick: 'Unknown',
                avatar: '',
            };
        }
    });
});

NotificationSchema.post('findOne', function(doc) {
    if (doc && !doc.receiver) {
        doc.receiver = {
            _id: '000000000000000000000000',
            nick: 'Unknown',
            avatar: '',
        };
    }
});