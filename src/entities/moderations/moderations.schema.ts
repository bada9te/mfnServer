import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "src/entities/users/users.schema";

export type ModerationDocument = HydratedDocument<Moderation>;

@Schema({ timestamps: true, expireAfterSeconds: 3600 * 15 })
export class Moderation {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: UserDocument;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    verifyToken: string;
}

export const ModerationSchema = SchemaFactory.createForClass(Moderation);