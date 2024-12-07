
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
    initiator: string;
    title: string;
    post1: string;
    post2: string;
    chainId?: Nullable<number>;
    contractAddress?: Nullable<string>;
}

export class MakeBattleVoteInput {
    battleId: string;
    postNScore: string;
    voteCount: number;
    voterId: string;
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
    sender?: Nullable<string>;
    post?: Nullable<string>;
    battle?: Nullable<string>;
    text: string;
    type: string;
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

export class SwitchTrackInPlaylistsInput {
    playlistsIds?: Nullable<string[]>;
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
    downloadsAllowed: boolean;
}

export class UpdatePostInput {
    post: string;
    what: string;
    value: string;
}

export class CreateReportInput {
    contactReason: string;
    email?: Nullable<string>;
    message: string;
    reportOwner?: Nullable<string>;
    reportedPost?: Nullable<string>;
}

export class CreateSupportRequestInput {
    contactReason: string;
    email: string;
    message: string;
}

export class LinkEmailInput {
    userId: string;
    email: string;
}

export class SwitchLikeOrPostInSavedInput {
    userId: string;
    postId: string;
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

export class Achievement {
    _id: string;
    title?: Nullable<string>;
    achievement?: Nullable<string>;
    description?: Nullable<string>;
    type?: Nullable<string>;
    rarity?: Nullable<string>;
    posNumber?: Nullable<number>;
    rp?: Nullable<number>;
}

export abstract class IQuery {
    abstract allAchievements(): Nullable<Achievement[]> | Promise<Nullable<Achievement[]>>;

    abstract achievementsByIds(ids: string[]): Nullable<Achievement[]> | Promise<Nullable<Achievement[]>>;

    abstract achievementsByPos(pos: number[]): Nullable<Achievement[]> | Promise<Nullable<Achievement[]>>;

    abstract achievemenmtsCount(): number | Promise<number>;

    abstract battleById(_id: string): Battle | Promise<Battle>;

    abstract battlesByStatus(finished: boolean, offset: number, limit: number): BattlesWithCount | Promise<BattlesWithCount>;

    abstract battlesUserParticipatedIn(userId: string, offset: number, limit: number): BattlesWithCount | Promise<BattlesWithCount>;

    abstract moderationActionValidate(input: ModerateActionInput): ModerationAction | Promise<ModerationAction>;

    abstract notifications(receiverId: string, checked: boolean, offset: number, limit: number): NotificationsWithCount | Promise<NotificationsWithCount>;

    abstract notificationsByIds(ids: string[]): Nullable<Notification[]> | Promise<Nullable<Notification[]>>;

    abstract playlist(_id: string): Playlist | Promise<Playlist>;

    abstract playlistsByTitle(title: string): Nullable<Playlist[]> | Promise<Nullable<Playlist[]>>;

    abstract playlistsByOwnerId(owner: string, offset: number, limit: number): PlaylistsWithCount | Promise<PlaylistsWithCount>;

    abstract playlistsPublicAvailable(offset: number, limit: number): PlaylistsWithCount | Promise<PlaylistsWithCount>;

    abstract post(_id: string): Post | Promise<Post>;

    abstract posts(offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsByOwner(owner: string, offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsByTitle(input: PostsByTitleInput): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsByIds(ids: string[]): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsMostPopular(date: Date): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsByCategory(category: string, offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsByCategoryCount(): PostsByCategoryCount | Promise<PostsByCategoryCount>;

    abstract postsSavedByUser(user: string, offset: number, limit: number): PostsWithCount | Promise<PostsWithCount>;

    abstract postsMostRecent(): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract postsMostRecentByFollowing(user: string): Nullable<Post[]> | Promise<Nullable<Post[]>>;

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

    abstract userAchievementsData(_id: string): Nullable<UserAchievementsData> | Promise<Nullable<UserAchievementsData>>;

    abstract userPinnedTracks(_id: string): Nullable<Post[]> | Promise<Nullable<Post[]>>;
}

export class Battle {
    _id: string;
    title: string;
    chainId?: Nullable<number>;
    contractAddress?: Nullable<string>;
    initiator?: Nullable<User>;
    post1?: Nullable<Post>;
    post2?: Nullable<Post>;
    post1Score: number;
    post2Score: number;
    winner?: Nullable<Post>;
    createdAt: string;
    willFinishAt: string;
    finished: boolean;
    votedBy?: Nullable<Nullable<User>[]>;
}

export class BattlesWithCount {
    battles?: Nullable<Battle[]>;
    count: number;
}

export abstract class IMutation {
    abstract battleCreate(input: AddNewBattleByPostsIdsInput): Battle | Promise<Battle>;

    abstract battleDeleteById(_id: string): Battle | Promise<Battle>;

    abstract battleMakeVote(input: MakeBattleVoteInput): Battle | Promise<Battle>;

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

    abstract playlistsSwitchTrack(input?: Nullable<SwitchTrackInPlaylistsInput>): Nullable<Playlist[]> | Promise<Nullable<Playlist[]>>;

    abstract postCreate(input: AddPostInput): Post | Promise<Post>;

    abstract postUpdate(input: UpdatePostInput): Post | Promise<Post>;

    abstract postDeleteById(_id: string): Post | Promise<Post>;

    abstract reportCreate(input: CreateReportInput): Report | Promise<Report>;

    abstract reportClose(_id: string): Report | Promise<Report>;

    abstract supportRequestCreate(input: CreateSupportRequestInput): SupportRequest | Promise<SupportRequest>;

    abstract supportRequestClose(_id: string): SupportRequest | Promise<SupportRequest>;

    abstract userCreate(input: AddUserInput): UserWithAction | Promise<UserWithAction>;

    abstract userUpdate(input: UpdateUserInput): User | Promise<User>;

    abstract userSwitchSubscription(input: SwitchSubscriptionOnUserInput): TwoUsers | Promise<TwoUsers>;

    abstract userConfirmAccount(input: AccountConfirmInput): UserWithAction | Promise<UserWithAction>;

    abstract userRestoreAccount(input: AccountRestoreInput): UserWithAction | Promise<UserWithAction>;

    abstract userPrepareAccountToRestore(input?: Nullable<PrepareAccountToRestoreInput>): UserWithAction | Promise<UserWithAction>;

    abstract userUnlinkGoogle(_id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract userUnlinkFacebook(_id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract userUnlinkTwitter(_id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract login(email: string, password: string): Nullable<User> | Promise<Nullable<User>>;

    abstract userSwitchLike(input: SwitchLikeOrPostInSavedInput): SwitchLikeOrPostInSavedReturnType | Promise<SwitchLikeOrPostInSavedReturnType>;

    abstract userSwitchSave(input: SwitchLikeOrPostInSavedInput): SwitchLikeOrPostInSavedReturnType | Promise<SwitchLikeOrPostInSavedReturnType>;

    abstract userSwitchPostPinned(userId: string, postId: string): User | Promise<User>;

    abstract userLinkEmailRequest(input: LinkEmailInput): Nullable<User> | Promise<Nullable<User>>;
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
    receiver?: Nullable<User>;
    sender?: Nullable<User>;
    post?: Nullable<Post>;
    battle?: Nullable<Battle>;
    type: string;
    text?: Nullable<string>;
    checked: boolean;
    createdAt: string;
}

export class NotificationsWithCount {
    notifications?: Nullable<Notification[]>;
    count: number;
}

export class NotificationCount {
    count: number;
}

export class Playlist {
    _id: string;
    owner?: Nullable<User>;
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
    soul: number;
    hipHop: number;
    rock: number;
    electronic: number;
    latin: number;
    jazz: number;
    blues: number;
    folk: number;
    metal: number;
    reggae: number;
}

export class Post {
    _id: string;
    owner?: Nullable<User>;
    title: string;
    description: string;
    audio: string;
    image: string;
    likes: number;
    saves: number;
    category: string;
    downloadsAllowed: boolean;
    createdAt: string;
}

export class Report {
    _id: string;
    contactReason: string;
    email?: Nullable<string>;
    message: string;
    reportOwner?: Nullable<User>;
    reportedPost?: Nullable<Post>;
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
    nick: string;
    description: string;
    avatar: string;
    background: string;
    subscribers?: Nullable<User[]>;
    subscribedOn?: Nullable<User[]>;
    achievements?: Nullable<number[]>;
    likedPosts?: Nullable<Post[]>;
    savedPosts?: Nullable<Post[]>;
    level: number;
    local?: Nullable<SocialMediaData>;
    google?: Nullable<SocialMediaData>;
    facebook?: Nullable<SocialMediaData>;
    twitter?: Nullable<SocialMediaData>;
}

export class SocialMediaData {
    email?: Nullable<string>;
    name?: Nullable<string>;
}

export class TwoUsers {
    subscriber: User;
    subscribeOn: User;
}

export class UserWithAction {
    user: User;
    action: ModerationAction;
}

export class SwitchLikeOrPostInSavedReturnType {
    post: Post;
    user: User;
}

export class UserAchievementsData {
    achievements?: Nullable<number[]>;
    totalLikes: number;
    totalSaves: number;
    maxLikesByPost: number;
    maxSavesByPost: number;
    postCount: number;
    maxLikesPostId?: Nullable<string>;
    maxSavesPostId?: Nullable<string>;
    totalRP: number;
}

type Nullable<T> = T | null;
