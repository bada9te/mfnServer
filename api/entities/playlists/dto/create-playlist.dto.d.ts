import { CreatePlaylistInput } from "src/graphql/graphql.schema";
export declare class CreatePlaylistDto extends CreatePlaylistInput {
    owner: string;
    title: string;
    public: boolean;
}
