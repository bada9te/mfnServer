export type TTask = {
    _id: string,
    id: string;
    date: Date; 
    taskType: "finishBattle" | "unknown";
    createdAt: string;
}