import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ timestamps: true })
export class Achievement {
    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    achievement: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    type: "basic" | "likes-total" | 
        "saves-total" | "likes" | "saves" |
        "likes-and-saves" | "tracks" | "likes-and-saves-equals"

    @Prop({ type: String, required: true })
    rarity: "legendary" | "uncommon" | "rare" | "common";

    @Prop({ type: Number, required: true })
    posNumber: number;

    @Prop({ type: Number, required: true, default: 0 })
    rp: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);