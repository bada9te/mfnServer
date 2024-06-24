
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Range {
    offset: number;
    limit: number;
}

export class AddNewBattleByPostsIdsInput {
    title: string;
    post1: string;
    post2: string;
}

export class MakeBattleVoteInput {
    battleId: string;
    postNScore: string;
    voteCount: number;
    voterId: string;
}

export class ChatMessageCreateInput {
    owner: string;
    type: string;
    text?: Nullable<string>;
    image?: Nullable<string>;
    video?: Nullable<string>;
    audio?: Nullable<string>;
    file?: Nullable<string>;
    spotify?: Nullable<string>;
    reply?: Nullable<string>;
    chat?: Nullable<string>;
    toUser?: Nullable<string>;
    sharedItem?: Nullable<string>;
}

export class ChatMessageUpdateInput {
    _id: string;
    text: string;
}

export class ChatCreateInput {
    title: string;
    owner: string;
    participants?: Nullable<string[]>;
}

export class ChatUpdateInput {
    _id: string;
    what: string;
    value: string;
}

export class AddCommentInput {
    owner: string;
    receiver?: Nullable<string>;
    text: string;
    isReply: boolean;
    isReplyTo?: Nullable<string>;
    post: string;
}

export class CreateModerationActionInput {
    user: string;
    type: string;
}

export class ModerateActionInput {
    userId: string;
    actionId: string;
    type: string;
    verifyToken: string;
}

export class CreateNotificationInput {
    receiver: string;
    sender: string;
    post?: Nullable<string>;
    comment?: Nullable<string>;
    text: string;
}

export class CreatePlaylistInput {
    owner: string;
    title: string;
    public: boolean;
}

export class SwitchTrackInPlaylistInput {
    playlistId: string;
    trackId: string;
}

export class PostsByTitleInput {
    title: string;
    userId?: Nullable<string>;
    userIsOwner?: Nullable<boolean>;
}

export class AddPostInput {
    owner: string;
    title: string;
    description: string;
    audio: string;
    image: string;
    category: string;
    commentsAllowed: boolean;
    downloadsAllowed: boolean;
}

export class UpdatePostInput {
    post: string;
    what: string;
    value: string;
}

export class SwitchLikeOrPostInSavedInput {
    userId: string;
    postId: string;
}

export class CreateReportInput {
    contactReason: string;
    email?: Nullable<string>;
    message: string;
    reportOwner?: Nullable<string>;
    reportedPost?: Nullable<string>;
    reportedComment?: Nullable<string>;
}

export class CreateSupportRequestInput {
    contactReason: string;
    email: string;
    message: string;
}

export class AddUserInput {
    email: string;
    nick: string;
    password: string;
}

export class UpdateUserInput {
    _id: string;
    what: string;
    value: string;
}

export class SwitchSubscriptionOnUserInput {
    subscriberId: string;
    userId: string;
}

export class AccountConfirmInput {
    userId: string;
    actionId: string;
    verifyToken: string;
}

export class AccountRestoreInput {
    userId: string;
    actionId: string;
    verifyToken: string;
    type: string;
    newValue: string;
}

export class PrepareAccountToRestoreInput {
    email: string;
    type: string;
}

export abstract class IQuery {
    abstract battlesByStatus(finished: boolean, offset: number, limit: number): BattlesWithCount | Promise<BattlesWithCount>;

    abstract chatMessage(_id: string): ChatMessage | Promise<ChatMessage>;

    abstract chatMessagesByChatId(_id: string, offset: number, limit: number): Nullable<ChatMessage[]> | Promise<Nullable<ChatMessage[]>>;

    abstract chat(_id: string, userId?: Nullable<string>): Chat | Promise<Chat>;

    abstract chatsByIds(ids: string[]): Nullable<Chat[]> | Promise<Nullable<Chat[]>>;

    abstract chatsUserRelatedByUserId(_id: string): Nullable<Chat[]> | Promise<Nullable<Chat[]>>;

    abstract comment(_id: string): Comment | Promise<Comment>;

    abstract commentsByIds(ids: string[]): Nullable<Comment[]> | Promise<Nullable<Comment[]>>;

    abstract commentReplies(_id: string): Nullable<Comment[]> | Promise<Nullable<Comment[]>>;

    abstract commentsByPostId(_id: string): Nullable<Comment[]> | Promise<Nullable<Comment[]>>;

    abstract moderationActionValidate(input: ModerateActionInput): ModerationAction | Promise<ModerationAction>;

    abstract notifications(receiverId: string, checked: boolean): Nullable<Notification[]> | Promise<Nullable<Notification[]>>;

    abstract notificationsByIds(ids: string[]): Nullable<Notification[]> | Promise<Nullable<Notification[]>>;

    abstract playlistsByTitle(title: string): Nullable<Playlist[]> | Promise<Nullable<Playlist[]>>;

    abstract playlistsByOwnerId(owner: string, offset: number, limit: number): PlaylistsWithCount | Promise<PlaylistsWithCount>;

    abstract playlistsPublicAvailable(offset: number, limit: number): PlaylistsWithCount | Promise<PlaylistsWithCount>;

    abstract post(_id: string): Post | Promise<Post>;

    abstract posts(offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsByOwner(owner: string, offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsSavedByUser(user: string, offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsByTitle(input: PostsByTitleInput): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsByIds(ids: string[]): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsMostPopular(date: Date): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsByCategory(category: string, offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsByCategoryCount(): PostsByCategoryCount | Promise<PostsByCategoryCount>;

    abstract report(_id: string): Nullable<Report> | Promise<Nullable<Report>>;

    abstract reports(offset: number, limit: number): Nullable<Report[]> | Promise<Nullable<Report[]>>;

    abstract supportRequest(_id: string): Nullable<SupportRequest> | Promise<Nullable<SupportRequest>>;

    abstract supportRequests(offset: number, limit: number): SupportRequest[] | Promise<SupportRequest[]>;

    abstract user(_id: string): User | Promise<User>;

    abstract users(): Nullable<User[]> | Promise<Nullable<User[]>>;

    abstract userByEmail(email: string): User | Promise<User>;

    abstract usersByIds(ids: string[]): User[] | Promise<User[]>;

    abstract usersByNickname(nick: string): User[] | Promise<User[]>;

    abstract whoAmI(): Nullable<User> | Promise<Nullable<User>>;
}

export class Battle {
    _id: string;
    title: string;
    post1?: Nullable<Post>;
    post2?: Nullable<Post>;
    post1Score: number;
    post2Score: number;
    winner?: Nullable<Post>;
    createdAt: string;
    willFinishAt: string;
    finished: boolean;
    votedBy?: Nullable<User[]>;
}

export class BattlesWithCount {
    battles?: Nullable<Battle[]>;
    count: number;
}

export abstract class IMutation {
    abstract battleCreate(input: AddNewBattleByPostsIdsInput): Battle | Promise<Battle>;

    abstract battleDeleteById(_id: string): Battle | Promise<Battle>;

    abstract battleMakeVote(input: MakeBattleVoteInput): Battle | Promise<Battle>;

    abstract chatMessageCreate(input: ChatMessageCreateInput): ChatMessage | Promise<ChatMessage>;

    abstract chatMessageDeleteById(_id: string): ChatMessage | Promise<ChatMessage>;

    abstract chatMessageUpdate(input: ChatMessageUpdateInput): ChatMessage | Promise<ChatMessage>;

    abstract chatCreate(input: ChatCreateInput): Chat | Promise<Chat>;

    abstract chatUpdate(input: ChatUpdateInput): Chat | Promise<Chat>;

    abstract chatReadAllMessages(chatId: string, userId: string): Chat | Promise<Chat>;

    abstract chatSwitchParticipants(chatId: string, participants: string[]): Chat | Promise<Chat>;

    abstract chatSwitchMessage(chatId: string, messageId: string): Chat | Promise<Chat>;

    abstract chatDeleteById(_id: string): Chat | Promise<Chat>;

    abstract commentCreate(input: AddCommentInput): Comment | Promise<Comment>;

    abstract commentDeleteById(_id: string): Comment | Promise<Comment>;

    abstract moderationActionCreate(input: CreateModerationActionInput): ModerationAction | Promise<ModerationAction>;

    abstract moderationActionDelete(input: ModerateActionInput): ModerationAction | Promise<ModerationAction>;

    abstract notificationCreate(input: CreateNotificationInput): Notification | Promise<Notification>;

    abstract notificationDeleteById(_id: string): Notification | Promise<Notification>;

    abstract notificationsDeleteByIds(ids: string[]): NotificationCount | Promise<NotificationCount>;

    abstract notificationMarkAsReadById(_id: string): Notification | Promise<Notification>;

    abstract notificationsMarkAsReadByIds(ids: string[]): NotificationCount | Promise<NotificationCount>;

    abstract playlistCreate(input: CreatePlaylistInput): Playlist | Promise<Playlist>;

    abstract playlistDeleteById(_id: string): Playlist | Promise<Playlist>;

    abstract playlistSwicthTrack(input?: Nullable<SwitchTrackInPlaylistInput>): Playlist | Promise<Playlist>;

    abstract postCreate(input: AddPostInput): Post | Promise<Post>;

    abstract postUpdate(input: UpdatePostInput): Post | Promise<Post>;

    abstract postDeleteById(_id: string): Post | Promise<Post>;

    abstract postSwitchLike(input: SwitchLikeOrPostInSavedInput): Post | Promise<Post>;

    abstract postSwicthInSaved(input: SwitchLikeOrPostInSavedInput): Post | Promise<Post>;

    abstract reportCreate(input: CreateReportInput): Report | Promise<Report>;

    abstract reportClose(_id: string): Report | Promise<Report>;

    abstract supportRequestCreate(input: CreateSupportRequestInput): SupportRequest | Promise<SupportRequest>;

    abstract supportRequestClose(_id: string): SupportRequest | Promise<SupportRequest>;

    abstract userCreate(input: AddUserInput): UserWithAction | Promise<UserWithAction>;

    abstract userDeleteById(_id: string): User | Promise<User>;

    abstract userUpdate(input: UpdateUserInput): User | Promise<User>;

    abstract userSwitchSubscription(input: SwitchSubscriptionOnUserInput): TwoUsers | Promise<TwoUsers>;

    abstract userConfirmAccount(input: AccountConfirmInput): UserWithAction | Promise<UserWithAction>;

    abstract userRestoreAccount(input: AccountRestoreInput): UserWithAction | Promise<UserWithAction>;

    abstract userPrepareAccountToRestore(input?: Nullable<PrepareAccountToRestoreInput>): UserWithAction | Promise<UserWithAction>;

    abstract login(email: string, password: string): Nullable<User> | Promise<Nullable<User>>;
}

export class ChatMessage {
    _id: string;
    owner: User;
    chat: Chat;
    text?: Nullable<string>;
    image?: Nullable<string>;
    video?: Nullable<string>;
    audio?: Nullable<string>;
    file?: Nullable<string>;
    spotify?: Nullable<string>;
    reply?: Nullable<ChatMessage>;
    createdAt: string;
}

export class MessagesUnreadCount {
    user: User;
    count: number;
}

export class Chat {
    _id: string;
    title: string;
    owner?: Nullable<User>;
    participants?: Nullable<Nullable<User>[]>;
    messagesUnreadCount?: Nullable<Nullable<MessagesUnreadCount>[]>;
}

export class Comment {
    _id: string;
    owner?: Nullable<User>;
    receiver?: Nullable<User>;
    text: string;
    isReply?: Nullable<boolean>;
    replies?: Nullable<Comment[]>;
    post: Post;
    createdAt: string;
}

export class ModerationAction {
    _id: string;
    user: User;
    type: string;
    verifyToken: string;
    createdAt: string;
}

export class Notification {
    _id: string;
    receiver: User;
    sender: User;
    post?: Nullable<Post>;
    comment?: Nullable<Comment>;
    text: string;
    checked: boolean;
    createdAt: string;
}

export class NotificationCount {
    count: number;
}

export class Playlist {
    _id: string;
    owner: User;
    title: string;
    tracks?: Nullable<Post[]>;
    public: boolean;
    createdAt: string;
}

export class PlaylistsWithCount {
    playlists?: Nullable<Playlist[]>;
    count: number;
}

export class PostsWithCount {
    posts?: Nullable<Post[]>;
    count: number;
}

export class PostsByCategoryCount {
    country: number;
    pop: number;
    classical: number;
    funk: number;
    soulMusic: number;
    hipHop: number;
    rock: number;
    electronicMusic: number;
    latin: number;
    jazz: number;
    blues: number;
    folk: number;
    metal: number;
}

export class Post {
    _id: string;
    owner: User;
    title: string;
    description: string;
    audio: string;
    image: string;
    likedBy?: Nullable<User[]>;
    savedBy?: Nullable<User[]>;
    comments?: Nullable<Comment[]>;
    category: string;
    downloadsAllowed: boolean;
    commentsAllowed: boolean;
    createdAt: string;
}

export class Report {
    _id: string;
    contactReason: string;
    email?: Nullable<string>;
    message: string;
    reportOwner?: Nullable<User>;
    reportedPost?: Nullable<Post>;
    reportedComment?: Nullable<Comment>;
    isClosed: boolean;
}

export class SupportRequest {
    _id: string;
    contactReason: string;
    email: string;
    message: string;
    isClosed: boolean;
}

export class User {
    _id: string;
    email: string;
    nick: string;
    description: string;
    avatar: string;
    background: string;
    subscribers?: Nullable<User[]>;
    subscribedOn?: Nullable<User[]>;
}

export class TwoUsers {
    user1: User;
    user2: User;
}

export class UserWithAction {
    user: User;
    action: ModerationAction;
}

type Nullable<T> = T | null;
