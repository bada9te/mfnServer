import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema({ timestamps: true })
export class SupportRequest {
    @Prop({ required: true })
    contactReason: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: false })
    isClosed: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);