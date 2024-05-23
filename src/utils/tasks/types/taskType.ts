export type TTask = {
    _id: string,
    date: Date; 
    taskType: "FINISH_BATTLE" | "unknown";
    createdAt: string;
}