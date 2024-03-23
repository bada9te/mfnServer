export type TNewComment = {
    owner: string,
    receiver?: string,
    text: string,
    isReply: boolean,
    isReplyTo?: string,
    post: string,
}