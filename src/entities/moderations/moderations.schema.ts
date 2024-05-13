import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/entities/users/users.schema";

export type ModerationDocument = HydratedDocument<Moderation>;

@Schema({ timestamps: true })
export class Moderation {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    verifyToken: string;
}

export const ModerationSchema = SchemaFactory.createForClass(Moderation);