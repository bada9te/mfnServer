import { AddNewBattleByPostsIdsInput } from "src/graphql/graphql.schema";
export declare class CreateBattleDto extends AddNewBattleByPostsIdsInput {
    title: string;
    post1: string;
    post2: string;
    initiator: string;
}
