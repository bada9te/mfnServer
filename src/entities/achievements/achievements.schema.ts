import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ timestamps: true })
export class Achievement {
    @Prop({ required: true }) 
    title: string;

    @Prop({ required: true })
    achievement: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    type: "basic" | "likes-total" | 
        "saves-total" | "likes" | "saves" |
        "likes-and-saves" | "tracks" | "likes-and-saves-equals"

    @Prop({ required: true })
    rarity: "legendary" | "uncommon" | "rare" | "common";

    @Prop({ required: true })
    posNumber: number;

    @Prop({ required: true, default: 0 })
    rp: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);