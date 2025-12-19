import { AddPostInput } from "src/graphql/graphql.schema";
export declare class CreatePostDto extends AddPostInput {
    owner: string;
    title: string;
    description: string;
    audio: string;
    image: string;
    category: string;
    downloadsAllowed: boolean;
}
