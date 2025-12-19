import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema({ timestamps: true })
export class SupportRequest {
    @Prop({ type: String, required: true })
    contactReason: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: Boolean, default: false })
    isClosed: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);