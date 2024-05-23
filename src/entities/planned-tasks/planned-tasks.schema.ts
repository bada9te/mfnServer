import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlannedTaskDocument = HydratedDocument<PlannedTask>;


@Schema({timestamps: true})
export class PlannedTask {
    @Prop({ required: true })
    relatedEntityId: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    taskType: string;
}

export const PlannedTasksSchema = SchemaFactory.createForClass(PlannedTask);
