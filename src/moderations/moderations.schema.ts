import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/users.schema";

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