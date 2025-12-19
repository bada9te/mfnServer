import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "../../entities/posts/posts.schema";
import { UserDocument } from "../../entities/users/users.schema";


export type PlaylistDocument = HydratedDocument<Playlist>;


@Schema({ timestamps: true })
export class Playlist {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true })
    owner: UserDocument;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }] })
    tracks: PostDocument[];

    @Prop({ type: Boolean, default: false })
    public: boolean;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.post('find', function(docs) {
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
  
PlaylistSchema.post('findOne', function(doc) {
    if (doc && !doc.owner) {
        doc.owner = {
            _id: '000000000000000000000000',
            nick: 'Unknown',
            avatar: '',
        };
    }
});