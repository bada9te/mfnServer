import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ timestamps: true })
export class Achievement {
    @Prop({ required: true }) 
    title: string;

    @Prop({ required: true })
    likesRequired: number;

    @Prop({ required: true })
    savesRequired: number;

    @Prop({ required: true })
    postsRequired: number;

    @Prop({ required: true })
    subscribersRequired: number;

    @Prop({ required: true })
    subscriptionsRequired: number;

    @Prop({required: true})
    winsInBattlesRequired: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);