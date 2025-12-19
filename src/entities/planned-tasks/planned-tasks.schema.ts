import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlannedTaskDocument = HydratedDocument<PlannedTask>;


@Schema({timestamps: true})
export class PlannedTask {
    @Prop({ type: String, required: true })
    relatedEntityId: string;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ type: String, required: true })
    taskType: string;
}

export const PlannedTasksSchema = SchemaFactory.createForClass(PlannedTask);
