import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "src/entities/users/users.schema";


export type PostDocument = HydratedDocument<Post>;


@Schema({ timestamps: true })
export class Post {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true })
    owner: UserDocument;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    audio: string;

    @Prop({ required: true })
    image: string;

    @Prop({default: 0})
    likes: number;

    @Prop({default: 0})
    saves: number;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    downloadsAllowed: boolean;
}
export const PostSchema = SchemaFactory.createForClass(Post);


PostSchema.plugin(require("mongoose-autopopulate"));


PostSchema.post('find', function(docs) {
    docs.forEach(doc => {
        if (!doc.owner) {
            doc.owner = {
                _id: '000000000000000000000000',
                nick: 'Unknown',
                avatar: '',
            };
        }
    });
});
  
PostSchema.post('findOne', function(doc) {
    if (doc && !doc.owner) {
        doc.owner = {
            _id: '000000000000000000000000',
            nick: 'Unknown',
            avatar: '',
        };
    }
});
